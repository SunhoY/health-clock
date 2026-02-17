export const AUTH_STORAGE_KEY = 'health-clock.google-auth';
export const SESSION_MODE_STORAGE_KEY = 'health-clock.session-mode';

export type SessionMode = 'authenticated' | 'guest';

export interface StoredAuthSession {
  accessToken?: string;
  tokenType?: string;
}

const readJson = <T>(key: string): T | null => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const readAuthSession = (): StoredAuthSession | null => {
  return readJson<StoredAuthSession>(AUTH_STORAGE_KEY);
};

export const storeAuthSession = (session: Record<string, unknown>) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const isSessionMode = (value: string): value is SessionMode => {
  return value === 'authenticated' || value === 'guest';
};

export const readSessionMode = (): SessionMode | null => {
  const raw = localStorage.getItem(SESSION_MODE_STORAGE_KEY);
  if (!raw || !isSessionMode(raw)) {
    return null;
  }

  return raw;
};

export const setSessionMode = (mode: SessionMode) => {
  localStorage.setItem(SESSION_MODE_STORAGE_KEY, mode);
};

export const getSessionMode = (): SessionMode => {
  const mode = readSessionMode();
  if (mode === 'guest') {
    return 'guest';
  }

  return readAuthSession()?.accessToken ? 'authenticated' : 'guest';
};

export const isAuthenticatedMode = (): boolean => {
  return getSessionMode() === 'authenticated';
};
