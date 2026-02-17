import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthProviderDto } from './dto/auth-provider.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('providers')
  getAuthProviders(): AuthProviderDto[] {
    return this.authService.getAuthProviders();
  }

  @Get('google/start')
  startGoogleAuth(@Res() response: Response): void {
    const authUrl = this.authService.createGoogleAuthStartUrl();
    response.redirect(302, authUrl);
  }
}
