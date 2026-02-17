import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

interface UserRow {
  id: string;
  email: string;
  displayName: string | null;
}

export interface GoogleUserProfile {
  providerUserId: string;
  email: string;
  displayName?: string;
  profileImageUrl?: string;
}

export interface AppUser {
  id: string;
  email: string;
}

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOrCreateGoogleUser(profile: GoogleUserProfile): Promise<AppUser> {
    const provider = 'google';

    const linkedUser = await this.findUserByOAuthAccount(
      provider,
      profile.providerUserId
    );
    if (linkedUser) {
      return linkedUser;
    }

    return this.databaseService.withTransaction<AppUser>(async (client) => {
      const existingLinkedUser = await client.query<UserRow>(
        `
          SELECT
            users.id,
            users.email,
            users.display_name AS "displayName"
          FROM oauth_accounts
          INNER JOIN users ON users.id = oauth_accounts.user_id
          WHERE oauth_accounts.provider = $1
            AND oauth_accounts.provider_user_id = $2
            AND users.deleted_at IS NULL
          LIMIT 1
        `,
        [provider, profile.providerUserId]
      );

      if (existingLinkedUser.rows[0]) {
        return this.toAppUser(existingLinkedUser.rows[0]);
      }

      const existingUserByEmail = await client.query<UserRow>(
        `
          SELECT id, email, display_name AS "displayName"
          FROM users
          WHERE LOWER(email) = LOWER($1)
            AND deleted_at IS NULL
          LIMIT 1
        `,
        [profile.email]
      );

      const user =
        existingUserByEmail.rows[0] ??
        (
          await client.query<UserRow>(
            `
              INSERT INTO users (
                email,
                display_name,
                profile_image_url
              )
              VALUES ($1, $2, $3)
              RETURNING id, email, display_name AS "displayName"
            `,
            [
              profile.email,
              profile.displayName ?? null,
              profile.profileImageUrl ?? null
            ]
          )
        ).rows[0];

      await client.query(
        `
          INSERT INTO oauth_accounts (
            user_id,
            provider,
            provider_user_id,
            email_at_provider
          )
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (provider, provider_user_id)
          DO UPDATE SET
            user_id = EXCLUDED.user_id,
            email_at_provider = EXCLUDED.email_at_provider,
            updated_at = now()
        `,
        [user.id, provider, profile.providerUserId, profile.email]
      );

      return this.toAppUser(user);
    });
  }

  private async findUserByOAuthAccount(
    provider: 'google',
    providerUserId: string
  ): Promise<AppUser | null> {
    const result = await this.databaseService.query<UserRow>(
      `
        SELECT
          users.id,
          users.email,
          users.display_name AS "displayName"
        FROM oauth_accounts
        INNER JOIN users ON users.id = oauth_accounts.user_id
        WHERE oauth_accounts.provider = $1
          AND oauth_accounts.provider_user_id = $2
          AND users.deleted_at IS NULL
        LIMIT 1
      `,
      [provider, providerUserId]
    );

    if (!result.rows[0]) {
      return null;
    }

    return this.toAppUser(result.rows[0]);
  }

  private toAppUser(row: UserRow): AppUser {
    return {
      id: row.id,
      email: row.email
    };
  }
}
