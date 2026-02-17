import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthExchangeResponseDto } from './dto/google-auth-exchange-response.dto';

describe('AuthController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService]
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

      expect(redirect).toHaveBeenCalledTimes(1);
      const [statusCode, location] = redirect.mock.calls[0];
      expect(statusCode).toBe(302);
      expect(typeof location).toBe('string');
      expect(location).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(new URL(location).searchParams.get('redirect_uri')).toBe(
        'http://localhost:4200/auth/google/loggedIn'
      );
      expect(new URL(location).searchParams.get('state')).toBeTruthy();
    });
  });

  describe('exchangeGoogleAuthCode', () => {
    it('should call service exchange with code and state', async () => {
      const controller = app.get<AuthController>(AuthController);
      const service = app.get<AuthService>(AuthService);
      const expectedResponse: GoogleAuthExchangeResponseDto = {
        accessToken: 'access-token',
        expiresIn: 3600,
        scope: 'openid email profile',
        tokenType: 'Bearer',
        idToken: 'id-token'
      };
      const exchangeSpy = jest
        .spyOn(service, 'exchangeGoogleAuthCode')
        .mockResolvedValue(expectedResponse);

      const result = await controller.exchangeGoogleAuthCode({
        code: 'auth-code',
        state: 'oauth-state'
      });

      expect(exchangeSpy).toHaveBeenCalledWith('auth-code', 'oauth-state');
      expect(result).toEqual(expectedResponse);
    });
  });
});
