#!/usr/bin/env bash
set -euo pipefail

# Idempotent PostgreSQL installer for OCI VMs.
# Supported OS: Ubuntu 22.04/24.04, Oracle Linux 8/9.
# Optional env vars:
# - PG_MAJOR (default: 16, Oracle Linux only)
# - POSTGRES_ADMIN_PASSWORD
# - APP_DB_NAME
# - APP_DB_USER
# - APP_DB_PASSWORD

PG_MAJOR="${PG_MAJOR:-16}"
POSTGRES_ADMIN_PASSWORD="${POSTGRES_ADMIN_PASSWORD:-}"
APP_DB_NAME="${APP_DB_NAME:-}"
APP_DB_USER="${APP_DB_USER:-}"
APP_DB_PASSWORD="${APP_DB_PASSWORD:-}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root (sudo)."
  exit 1
fi

if [[ ! -f /etc/os-release ]]; then
  echo "Cannot detect OS (/etc/os-release missing)."
  exit 1
fi

# shellcheck source=/dev/null
source /etc/os-release
OS_ID="${ID:-}"
OS_VERSION_ID="${VERSION_ID:-}"
SERVICE_NAME=""
PSQL_BIN="psql"

log() {
  echo "[install-postgresql] $*"
}

sql_escape_literal() {
  # Escape single quotes for SQL literals.
  local v="$1"
  printf "%s" "${v//\'/\'\'}"
}

run_psql() {
  local sql="$1"
  su - postgres -c "${PSQL_BIN} -v ON_ERROR_STOP=1 -c \"${sql}\""
}

query_scalar() {
  local sql="$1"
  su - postgres -c "${PSQL_BIN} -tAc \"${sql}\""
}

install_on_ubuntu() {
  log "Installing PostgreSQL on Ubuntu ${OS_VERSION_ID}"
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-contrib
  SERVICE_NAME="postgresql"
  PSQL_BIN="psql"
}

install_on_oracle_linux() {
  log "Installing PostgreSQL ${PG_MAJOR} on Oracle Linux ${OS_VERSION_ID}"

  local repo_pkg="https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E '%{rhel}')-x86_64/pgdg-redhat-repo-latest.noarch.rpm"
  if ! rpm -qa | grep -q '^pgdg-redhat-repo'; then
    dnf install -y "${repo_pkg}"
  fi

  dnf -qy module disable postgresql || true
  dnf install -y "postgresql${PG_MAJOR}-server" "postgresql${PG_MAJOR}"

  if [[ ! -f "/var/lib/pgsql/${PG_MAJOR}/data/PG_VERSION" ]]; then
    "/usr/pgsql-${PG_MAJOR}/bin/postgresql-${PG_MAJOR}-setup" initdb
  fi

  SERVICE_NAME="postgresql-${PG_MAJOR}"
  PSQL_BIN="/usr/pgsql-${PG_MAJOR}/bin/psql"
}

configure_service() {
  log "Enabling and starting ${SERVICE_NAME}"
  systemctl enable --now "${SERVICE_NAME}"

  if ! systemctl is-active --quiet "${SERVICE_NAME}"; then
    echo "Service ${SERVICE_NAME} failed to start."
    systemctl status "${SERVICE_NAME}" --no-pager || true
    exit 1
  fi
}

configure_postgres_admin_password() {
  if [[ -z "${POSTGRES_ADMIN_PASSWORD}" ]]; then
    return
  fi

  local pwd_escaped
  pwd_escaped="$(sql_escape_literal "${POSTGRES_ADMIN_PASSWORD}")"
  log "Setting password for postgres role"
  run_psql "ALTER USER postgres WITH PASSWORD '${pwd_escaped}';"
}

configure_app_db() {
  if [[ -z "${APP_DB_NAME}" && -z "${APP_DB_USER}" && -z "${APP_DB_PASSWORD}" ]]; then
    return
  fi

  if [[ -z "${APP_DB_NAME}" || -z "${APP_DB_USER}" || -z "${APP_DB_PASSWORD}" ]]; then
    echo "APP_DB_NAME, APP_DB_USER, APP_DB_PASSWORD must all be set together."
    exit 1
  fi

  local user_escaped
  local db_escaped
  local pwd_escaped
  user_escaped="$(sql_escape_literal "${APP_DB_USER}")"
  db_escaped="$(sql_escape_literal "${APP_DB_NAME}")"
  pwd_escaped="$(sql_escape_literal "${APP_DB_PASSWORD}")"

  log "Ensuring app role exists: ${APP_DB_USER}"
  if [[ "$(query_scalar "SELECT 1 FROM pg_roles WHERE rolname='${user_escaped}';")" != "1" ]]; then
    run_psql "CREATE ROLE \"${APP_DB_USER}\" LOGIN PASSWORD '${pwd_escaped}';"
  else
    run_psql "ALTER ROLE \"${APP_DB_USER}\" WITH LOGIN PASSWORD '${pwd_escaped}';"
  fi

  log "Ensuring app database exists: ${APP_DB_NAME}"
  if [[ "$(query_scalar "SELECT 1 FROM pg_database WHERE datname='${db_escaped}';")" != "1" ]]; then
    su - postgres -c "createdb --owner=\"${APP_DB_USER}\" \"${APP_DB_NAME}\""
  fi

  run_psql "GRANT ALL PRIVILEGES ON DATABASE \"${APP_DB_NAME}\" TO \"${APP_DB_USER}\";"
}

case "${OS_ID}" in
  ubuntu)
    install_on_ubuntu
    ;;
  ol)
    install_on_oracle_linux
    ;;
  *)
    echo "Unsupported OS: ${OS_ID}. Supported: ubuntu, ol (Oracle Linux)."
    exit 1
    ;;
esac

configure_service
configure_postgres_admin_password
configure_app_db

log "PostgreSQL installation complete"
su - postgres -c "${PSQL_BIN} -tAc 'SELECT version();'"
