import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthProviderDto } from './dto/auth-provider.dto';
import type { GoogleAuthExchangeRequestDto } from './dto/google-auth-exchange-request.dto';
import type { GoogleAuthExchangeResponseDto } from './dto/google-auth-exchange-response.dto';

interface RequestLike {
  headers?: Record<string, string | string[] | undefined>;
}

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
  startGoogleAuth(
    @Req() request: RequestLike,
    @Res() response: RedirectResponse
  ): void {
    const authUrl = this.authService.createGoogleAuthStartUrl(
      this.getRequestOrigin(request)
    );
    response.redirect(302, authUrl);
  }

  @Post('google/exchange')
  exchangeGoogleAuthCode(
    @Body() payload: GoogleAuthExchangeRequestDto
  ): Promise<GoogleAuthExchangeResponseDto> {
    return this.authService.exchangeGoogleAuthCode(payload.code, payload.state);
  }

  private getRequestOrigin(request: RequestLike): string | undefined {
    return this.getHeaderValue(request, 'origin');
  }

  private getHeaderValue(
    request: RequestLike,
    headerName: string
  ): string | undefined {
    const rawValue = request.headers?.[headerName];
    if (!rawValue) {
      return undefined;
    }

    if (Array.isArray(rawValue)) {
      return rawValue[0];
    }

    return rawValue.split(',')[0]?.trim() || undefined;
  }
}
