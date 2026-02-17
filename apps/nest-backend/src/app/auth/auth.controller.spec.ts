import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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

      controller.startGoogleAuth({ redirect } as never);

      expect(redirect).toHaveBeenCalledTimes(1);
      const [statusCode, location] = redirect.mock.calls[0];
      expect(statusCode).toBe(302);
      expect(typeof location).toBe('string');
      expect(location).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(new URL(location).searchParams.get('state')).toBeTruthy();
    });
  });
});
