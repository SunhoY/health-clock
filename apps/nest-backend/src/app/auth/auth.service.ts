import axios from 'axios';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AuthProviderDto } from './dto/auth-provider.dto';
import { GoogleAuthExchangeResponseDto } from './dto/google-auth-exchange-response.dto';

interface OAuthStateContext {
  expiresAt: number;
  redirectUri: string;
}

@Injectable()
export class AuthService {
  private readonly oauthStateTtlMs = 5 * 60 * 1000;
  private readonly oauthStateStore = new Map<string, OAuthStateContext>();

  getAuthProviders(): AuthProviderDto[] {
    return [
      {
        id: 'google',
        label: 'Google',
        startUrl: '/api/auth/google/start'
      }
    ];
  }

  createGoogleAuthStartUrl(requestOrigin?: string): string {
    const googleAuthorizeEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    this.cleanupExpiredStates();
    const state = randomBytes(24).toString('base64url');
    const redirectUri = this.resolveGoogleRedirectUri(requestOrigin);
    this.oauthStateStore.set(state, {
      expiresAt: Date.now() + this.oauthStateTtlMs,
      redirectUri
    });

    const searchParams = new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? 'google-client-id',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: process.env.GOOGLE_OAUTH_SCOPE ?? 'openid email profile',
      state
    });

    return `${googleAuthorizeEndpoint}?${searchParams.toString()}`;
  }

  async exchangeGoogleAuthCode(
    code: string,
    state: string
  ): Promise<GoogleAuthExchangeResponseDto> {
    if (!code || !state) {
      throw new BadRequestException('Both code and state are required.');
    }

    this.cleanupExpiredStates();
    const redirectUri = this.consumeState(state);

    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? 'google-client-id',
          client_secret:
            process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? 'google-client-secret',
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
          code
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const data = response.data as {
        access_token: string;
        expires_in: number;
        refresh_token?: string;
        scope: string;
        token_type: string;
        id_token?: string;
      };

      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
        scope: data.scope,
        tokenType: data.token_type,
        idToken: data.id_token
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const providerError =
          typeof error.response?.data === 'object' && error.response?.data
            ? String(
                (
                  error.response.data as {
                    error?: string;
                    error_description?: string;
                  }
                ).error_description ??
                  (
                    error.response.data as {
                      error?: string;
                      error_description?: string;
                    }
                  ).error ??
                  'unknown_error'
              )
            : 'unknown_error';
        throw new BadGatewayException(
          `Failed to exchange authorization code with Google (${providerError}).`
        );
      }

      throw error;
    }
  }

  private cleanupExpiredStates(): void {
    const now = Date.now();
    for (const [state, context] of this.oauthStateStore.entries()) {
      if (context.expiresAt <= now) {
        this.oauthStateStore.delete(state);
      }
    }
  }

  private consumeState(state: string): string {
    const context = this.oauthStateStore.get(state);
    if (!context) {
      throw new UnauthorizedException('Invalid or expired OAuth state.');
    }

    if (context.expiresAt <= Date.now()) {
      this.oauthStateStore.delete(state);
      throw new UnauthorizedException('Invalid or expired OAuth state.');
    }

    this.oauthStateStore.delete(state);
    return context.redirectUri;
  }

  private resolveGoogleRedirectUri(requestOrigin?: string): string {
    const configuredRedirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI?.trim();
    if (configuredRedirectUri) {
      return configuredRedirectUri;
    }

    if (requestOrigin?.trim()) {
      try {
        return `${new URL(requestOrigin).origin}/auth/google/loggedIn`;
      } catch {
        // fallback to default local redirect uri when header is malformed
      }
    }

    return 'http://localhost:4200/auth/google/loggedIn';
  }
}
