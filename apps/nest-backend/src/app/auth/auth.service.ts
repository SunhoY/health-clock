import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AuthProviderDto } from './dto/auth-provider.dto';

@Injectable()
export class AuthService {
  private readonly oauthStateTtlMs = 5 * 60 * 1000;
  private readonly oauthStateStore = new Map<string, number>();

  getAuthProviders(): AuthProviderDto[] {
    return [
      {
        id: 'google',
        label: 'Google',
        startUrl: '/api/auth/google/start'
      }
    ];
  }

  createGoogleAuthStartUrl(): string {
    const googleAuthorizeEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    this.cleanupExpiredStates();
    const state = randomBytes(24).toString('base64url');
    this.oauthStateStore.set(state, Date.now() + this.oauthStateTtlMs);

    const searchParams = new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? 'google-client-id',
      redirect_uri:
        process.env.GOOGLE_OAUTH_REDIRECT_URI ??
        'http://localhost:4200/auth/google/loggedIn',
      response_type: 'code',
      scope: process.env.GOOGLE_OAUTH_SCOPE ?? 'openid email profile',
      state
    });

    return `${googleAuthorizeEndpoint}?${searchParams.toString()}`;
  }

  private cleanupExpiredStates(): void {
    const now = Date.now();
    for (const [state, expiresAt] of this.oauthStateStore.entries()) {
      if (expiresAt <= now) {
        this.oauthStateStore.delete(state);
      }
    }
  }
}
