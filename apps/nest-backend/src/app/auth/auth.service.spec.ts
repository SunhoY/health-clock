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
});
