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
import { AuthRepository } from './auth.repository';
import { JwtTokenService } from './jwt-token.service';

interface OAuthStateContext {
  expiresAt: number;
  redirectUri: string;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

interface GoogleUserInfoResponse {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  private readonly oauthStateTtlMs = 5 * 60 * 1000;
  private readonly oauthStateStore = new Map<string, OAuthStateContext>();

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtTokenService: JwtTokenService
  ) {}

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

    const tokenResponse = await this.exchangeAuthCodeWithGoogle(code, redirectUri);
    const userInfo = await this.fetchGoogleUserInfo(tokenResponse.access_token);

    const appUser = await this.authRepository.findOrCreateGoogleUser({
      providerUserId: userInfo.sub,
      email: userInfo.email,
      displayName: userInfo.name,
      profileImageUrl: userInfo.picture
    });

    const issuedToken = this.jwtTokenService.issueAccessToken({
      id: appUser.id,
      email: appUser.email,
      provider: 'google'
    });

    return {
      accessToken: issuedToken.accessToken,
      tokenType: 'Bearer',
      expiresIn: issuedToken.expiresIn,
      user: {
        id: appUser.id,
        email: appUser.email
      }
    };
  }

  private async exchangeAuthCodeWithGoogle(
    code: string,
    redirectUri: string
  ): Promise<GoogleTokenResponse> {
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

      return response.data as GoogleTokenResponse;
    } catch (error) {
      throw this.toGoogleGatewayError(error);
    }
  }

  private async fetchGoogleUserInfo(
    accessToken: string
  ): Promise<GoogleUserInfoResponse> {
    try {
      const response = await axios.get(
        'https://openidconnect.googleapis.com/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = response.data as GoogleUserInfoResponse;
      if (!data?.sub || !data?.email) {
        throw new BadGatewayException(
          'Failed to resolve user profile from Google (missing subject/email).'
        );
      }

      return data;
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw this.toGoogleGatewayError(error);
    }
  }

  private toGoogleGatewayError(error: unknown): BadGatewayException {
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

      return new BadGatewayException(
        `Google OAuth request failed (${providerError}).`
      );
    }

    return new BadGatewayException('Google OAuth request failed (unknown_error).');
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
    if (requestOrigin?.trim()) {
      try {
        return `${new URL(requestOrigin).origin}/auth/google/loggedIn`;
      } catch {
        throw new BadRequestException('Invalid request origin for OAuth redirect.');
      }
    }

    throw new BadRequestException('Unable to resolve OAuth redirect origin.');
  }
}
