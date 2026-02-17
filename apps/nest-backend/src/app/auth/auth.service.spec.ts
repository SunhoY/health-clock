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
    afterEach(() => {
      delete process.env.GOOGLE_OAUTH_CLIENT_ID;
    });

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
});
