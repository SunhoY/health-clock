import axios from 'axios';
import { BadGatewayException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AuthService]
    }).compile();

    service = app.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
      const url = service.createGoogleAuthStartUrl();
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
      const url = service.createGoogleAuthStartUrl();
      const parsed = new URL(url);

      expect(parsed.searchParams.get('client_id')).toBe('test-client-id');
    });

    it('should issue a unique state for every start url generation', () => {
      const first = new URL(service.createGoogleAuthStartUrl()).searchParams.get(
        'state'
      );
      const second = new URL(service.createGoogleAuthStartUrl()).searchParams.get(
        'state'
      );

      expect(first).toBeTruthy();
      expect(second).toBeTruthy();
      expect(first).not.toEqual(second);
    });
  });

  describe('exchangeGoogleAuthCode', () => {
    it('should exchange auth code to google tokens when state is valid', async () => {
      const createdUrl = new URL(service.createGoogleAuthStartUrl());
      const state = createdUrl.searchParams.get('state');
      const axiosPostSpy = jest.spyOn(axios, 'post').mockResolvedValue({
        data: {
          access_token: 'access-token',
          expires_in: 3600,
          refresh_token: 'refresh-token',
          scope: 'openid email profile',
          token_type: 'Bearer',
          id_token: 'id-token'
        }
      });

      const result = await service.exchangeGoogleAuthCode('code-123', state!);
      const [url, body, config] = axiosPostSpy.mock.calls[0];
      const params = new URLSearchParams(body as string);

      expect(url).toBe('https://oauth2.googleapis.com/token');
      expect(params.get('grant_type')).toBe('authorization_code');
      expect(params.get('code')).toBe('code-123');
      expect(params.get('state')).toBeNull();
      expect(config?.headers?.['Content-Type']).toBe(
        'application/x-www-form-urlencoded'
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        expiresIn: 3600,
        refreshToken: 'refresh-token',
        scope: 'openid email profile',
        tokenType: 'Bearer',
        idToken: 'id-token'
      });
    });

    it('should reject invalid state', async () => {
      await expect(
        service.exchangeGoogleAuthCode('code-123', 'invalid-state')
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should reject reused state', async () => {
      const state = new URL(service.createGoogleAuthStartUrl()).searchParams.get(
        'state'
      )!;
      jest.spyOn(axios, 'post').mockResolvedValue({
        data: {
          access_token: 'access-token',
          expires_in: 3600,
          scope: 'openid email profile',
          token_type: 'Bearer'
        }
      });

      await service.exchangeGoogleAuthCode('code-123', state);
      await expect(
        service.exchangeGoogleAuthCode('code-456', state)
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw bad gateway error when google exchange fails', async () => {
      const state = new URL(service.createGoogleAuthStartUrl()).searchParams.get(
        'state'
      )!;
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
