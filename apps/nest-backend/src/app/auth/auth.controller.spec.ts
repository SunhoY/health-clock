import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthExchangeResponseDto } from './dto/google-auth-exchange-response.dto';

describe('AuthController', () => {
  let app: TestingModule;
  let authService: {
    getAuthProviders: jest.Mock;
    createGoogleAuthStartUrl: jest.Mock;
    exchangeGoogleAuthCode: jest.Mock;
  };

  beforeAll(async () => {
    authService = {
      getAuthProviders: jest.fn().mockReturnValue([
        {
          id: 'google',
          label: 'Google',
          startUrl: '/api/auth/google/start'
        }
      ]),
      createGoogleAuthStartUrl: jest
        .fn()
        .mockReturnValue(
          'https://accounts.google.com/o/oauth2/v2/auth?state=state123&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth%2Fgoogle%2FloggedIn'
        ),
      exchangeGoogleAuthCode: jest.fn()
    };

    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    }).compile();
  });

  describe('getAuthProviders', () => {
    it('should return google provider from service', () => {
      const controller = app.get<AuthController>(AuthController);
      expect(controller.getAuthProviders()).toEqual([
        {
          id: 'google',
          label: 'Google',
          startUrl: '/api/auth/google/start'
        }
      ]);
      expect(authService.getAuthProviders).toHaveBeenCalledTimes(1);
    });
  });

  describe('startGoogleAuth', () => {
    it('should redirect with 302 to google oauth authorize url', () => {
      const controller = app.get<AuthController>(AuthController);
      const redirect = jest.fn();

      controller.startGoogleAuth(
        {
          headers: {
            origin: 'http://localhost:4200'
          }
        } as never,
        { redirect } as never
      );

      expect(authService.createGoogleAuthStartUrl).toHaveBeenCalledWith(
        'http://localhost:4200'
      );
      expect(redirect).toHaveBeenCalledTimes(1);
      const [statusCode, location] = redirect.mock.calls[0];
      expect(statusCode).toBe(302);
      expect(typeof location).toBe('string');
      expect(location).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(new URL(location).searchParams.get('redirect_uri')).toBe(
        'http://localhost:4200/auth/google/loggedIn'
      );
      expect(new URL(location).searchParams.get('state')).toBe('state123');
    });

    it('should use referer origin when origin header is missing', () => {
      const controller = app.get<AuthController>(AuthController);
      const redirect = jest.fn();

      controller.startGoogleAuth(
        {
          headers: {
            referer: 'https://app.example.com/somewhere'
          }
        } as never,
        { redirect } as never
      );

      expect(authService.createGoogleAuthStartUrl).toHaveBeenCalledWith(
        'https://app.example.com'
      );
      expect(redirect).toHaveBeenCalledTimes(1);
    });

    it('should use forwarded host and proto when origin/referer are missing', () => {
      const controller = app.get<AuthController>(AuthController);
      const redirect = jest.fn();

      controller.startGoogleAuth(
        {
          headers: {
            'x-forwarded-host': 'api.example.com',
            'x-forwarded-proto': 'https'
          }
        } as never,
        { redirect } as never
      );

      expect(authService.createGoogleAuthStartUrl).toHaveBeenCalledWith(
        'https://api.example.com'
      );
      expect(redirect).toHaveBeenCalledTimes(1);
    });

    it('should use host when origin/referer/forwarded-host are missing', () => {
      const controller = app.get<AuthController>(AuthController);
      const redirect = jest.fn();

      controller.startGoogleAuth(
        {
          headers: {
            host: 'localhost:4200'
          }
        } as never,
        { redirect } as never
      );

      expect(authService.createGoogleAuthStartUrl).toHaveBeenCalledWith(
        'http://localhost:4200'
      );
      expect(redirect).toHaveBeenCalledTimes(1);
    });
  });

  describe('exchangeGoogleAuthCode', () => {
    it('should call service exchange with code and state', async () => {
      const controller = app.get<AuthController>(AuthController);
      const expectedResponse: GoogleAuthExchangeResponseDto = {
        accessToken: 'app-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
        user: {
          id: 'user-1',
          email: 'user@example.com'
        }
      };
      authService.exchangeGoogleAuthCode.mockResolvedValue(expectedResponse);

      const result = await controller.exchangeGoogleAuthCode({
        code: 'auth-code',
        state: 'oauth-state'
      });

      expect(authService.exchangeGoogleAuthCode).toHaveBeenCalledWith(
        'auth-code',
        'oauth-state'
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});
