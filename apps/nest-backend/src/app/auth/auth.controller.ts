import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthProviderDto } from './dto/auth-provider.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('providers')
  getAuthProviders(): AuthProviderDto[] {
    return this.authService.getAuthProviders();
  }
}
