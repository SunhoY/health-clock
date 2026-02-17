import { Injectable } from '@nestjs/common';
import { AuthProviderDto } from './dto/auth-provider.dto';

@Injectable()
export class AuthService {
  getAuthProviders(): AuthProviderDto[] {
    return [
      {
        id: 'google',
        label: 'Google',
        startUrl: '/api/auth/google/start'
      }
    ];
  }
}
