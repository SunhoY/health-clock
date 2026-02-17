import axios from 'axios';
import {
  BadGatewayException,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtTokenService } from './jwt-token.service';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: {
    findOrCreateGoogleUser: jest.Mock;
  };
  let jwtTokenService: {
    issueAccessToken: jest.Mock;
  };

  beforeAll(async () => {
    authRepository = {
      findOrCreateGoogleUser: jest.fn()
    };
    jwtTokenService = {
      issueAccessToken: jest.fn()
    };

    const app = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: authRepository
        },
        {
          provide: JwtTokenService,
          useValue: jwtTokenService
        }
      ]
    }).compile();

    service = app.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    authRepository.findOrCreateGoogleUser.mockReset();
    jwtTokenService.issueAccessToken.mockReset();
    delete process.env.GOOGLE_OAUTH_CLIENT_ID;
    delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    delete process.env.GOOGLE_OAUTH_REDIRECT_URI;
    delete process.env.GOOGLE_OAUTH_SCOPE;
  });

  describe('getAuthProviders', () => {
    it('should return google auth provider configuration', () => {
      expect(service.getAuthProviders()).toEqual([
        {
          id: 'google',
          label: 'Google',
          startUrl: '/api/auth/google/start'
        }
      ]);
    });
  });

  describe('createGoogleAuthStartUrl', () => {
    it('should return google oauth authorize url with required params', () => {
      const url = service.createGoogleAuthStartUrl('http://localhost:4200');
      const parsed = new URL(url);

      expect(`${parsed.origin}${parsed.pathname}`).toBe(
        'https://accounts.google.com/o/oauth2/v2/auth'
      );
      expect(parsed.searchParams.get('client_id')).toBe('google-client-id');
      expect(parsed.searchParams.get('redirect_uri')).toBe(
        'http://localhost:4200/auth/google/loggedIn'
      );
      expect(parsed.searchParams.get('response_type')).toBe('code');
      expect(parsed.searchParams.get('scope')).toBe('openid email profile');
      expect(parsed.searchParams.get('state')).toBeTruthy();
    });

    it('should use GOOGLE_OAUTH_CLIENT_ID from environment when provided', () => {
      process.env.GOOGLE_OAUTH_CLIENT_ID = 'test-client-id';
      const url = service.createGoogleAuthStartUrl('http://localhost:4200');
      const parsed = new URL(url);

      expect(parsed.searchParams.get('client_id')).toBe('test-client-id');
    });

    it('should issue a unique state for every start url generation', () => {
      const first = new URL(
        service.createGoogleAuthStartUrl('http://localhost:4200')
      ).searchParams.get('state');
      const second = new URL(
        service.createGoogleAuthStartUrl('http://localhost:4200')
      ).searchParams.get('state');

      expect(first).toBeTruthy();
      expect(second).toBeTruthy();
      expect(first).not.toEqual(second);
    });

    it('should reject start url generation when origin is missing', () => {
      expect(() => service.createGoogleAuthStartUrl()).toThrow(
        BadRequestException
      );
    });

    it('should reject start url generation when origin is malformed', () => {
      expect(() => service.createGoogleAuthStartUrl('not-a-url')).toThrow(
        BadRequestException
      );
    });
  });

  describe('exchangeGoogleAuthCode', () => {
    it('should exchange auth code and issue app token when state is valid', async () => {
      const createdUrl = new URL(
        service.createGoogleAuthStartUrl('http://localhost:4200')
      );
      const state = createdUrl.searchParams.get('state');
      const axiosPostSpy = jest.spyOn(axios, 'post').mockResolvedValue({
        data: {
          access_token: 'google-access-token',
          expires_in: 3600,
          refresh_token: 'refresh-token',
          scope: 'openid email profile',
          token_type: 'Bearer',
          id_token: 'id-token'
        }
      });
      const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
          sub: 'google-sub-123',
          email: 'user@example.com',
          name: 'Tester',
          picture: 'https://example.com/profile.png'
        }
      });
      authRepository.findOrCreateGoogleUser.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com'
      });
      jwtTokenService.issueAccessToken.mockReturnValue({
        accessToken: 'app-token',
        expiresIn: 3600
      });

      const result = await service.exchangeGoogleAuthCode('code-123', state!);
      const [url, body, config] = axiosPostSpy.mock.calls[0];
      const params = new URLSearchParams(body as string);

      expect(url).toBe('https://oauth2.googleapis.com/token');
      expect(params.get('grant_type')).toBe('authorization_code');
      expect(params.get('code')).toBe('code-123');
      expect(params.get('state')).toBeNull();
      expect(params.get('redirect_uri')).toBe(
        'http://localhost:4200/auth/google/loggedIn'
      );
      expect(config?.headers?.['Content-Type']).toBe(
        'application/x-www-form-urlencoded'
      );
      expect(axiosGetSpy).toHaveBeenCalledWith(
        'https://openidconnect.googleapis.com/v1/userinfo',
        {
          headers: {
            Authorization: 'Bearer google-access-token'
          }
        }
      );
      expect(authRepository.findOrCreateGoogleUser).toHaveBeenCalledWith({
        providerUserId: 'google-sub-123',
        email: 'user@example.com',
        displayName: 'Tester',
        profileImageUrl: 'https://example.com/profile.png'
      });
      expect(jwtTokenService.issueAccessToken).toHaveBeenCalledWith({
        id: 'user-1',
        email: 'user@example.com',
        provider: 'google'
      });
      expect(result).toEqual({
        accessToken: 'app-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
        user: {
          id: 'user-1',
          email: 'user@example.com'
        }
      });
    });

    it('should reject invalid state', async () => {
      await expect(
        service.exchangeGoogleAuthCode('code-123', 'invalid-state')
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should reject reused state', async () => {
      const state = new URL(
        service.createGoogleAuthStartUrl('http://localhost:4200')
      ).searchParams.get('state')!;
      jest.spyOn(axios, 'post').mockResolvedValue({
        data: {
          access_token: 'google-access-token',
          expires_in: 3600,
          scope: 'openid email profile',
          token_type: 'Bearer'
        }
      });
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
          sub: 'google-sub-123',
          email: 'user@example.com'
        }
      });
      authRepository.findOrCreateGoogleUser.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com'
      });
      jwtTokenService.issueAccessToken.mockReturnValue({
        accessToken: 'app-token',
        expiresIn: 3600
      });

      await service.exchangeGoogleAuthCode('code-123', state);
      await expect(
        service.exchangeGoogleAuthCode('code-456', state)
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw bad gateway error when google exchange fails', async () => {
      const state = new URL(
        service.createGoogleAuthStartUrl('http://localhost:4200')
      ).searchParams.get('state')!;
      jest.spyOn(axios, 'post').mockRejectedValue({
        isAxiosError: true,
        response: {
          data: {
            error: 'invalid_grant',
            error_description: 'Bad Request'
          }
        }
      });

      await expect(
        service.exchangeGoogleAuthCode('code-123', state)
      ).rejects.toBeInstanceOf(BadGatewayException);
    });
  });
});
