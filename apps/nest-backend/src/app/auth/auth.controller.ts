import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthProviderDto } from './dto/auth-provider.dto';
import type { GoogleAuthExchangeRequestDto } from './dto/google-auth-exchange-request.dto';
import type { GoogleAuthExchangeResponseDto } from './dto/google-auth-exchange-response.dto';

interface RedirectResponse {
  redirect: (statusCode: number, url: string) => void;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('providers')
  getAuthProviders(): AuthProviderDto[] {
    return this.authService.getAuthProviders();
  }

  @Get('google/start')
  startGoogleAuth(@Res() response: RedirectResponse): void {
    const authUrl = this.authService.createGoogleAuthStartUrl();
    response.redirect(302, authUrl);
  }

  @Post('google/exchange')
  exchangeGoogleAuthCode(
    @Body() payload: GoogleAuthExchangeRequestDto
  ): Promise<GoogleAuthExchangeResponseDto> {
    return this.authService.exchangeGoogleAuthCode(payload.code, payload.state);
  }
}
