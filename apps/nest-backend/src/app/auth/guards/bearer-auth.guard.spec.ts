import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { BearerAuthGuard } from './bearer-auth.guard';
import { JwtTokenService } from '../jwt-token.service';

describe('BearerAuthGuard', () => {
  const createExecutionContext = (request: Record<string, unknown>) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request
      })
    }) as ExecutionContext;

  it('should set request.user when token is valid', () => {
    const jwtTokenService = {
      verifyAccessToken: jest.fn().mockReturnValue({
        sub: 'user-1',
        email: 'user@example.com',
        provider: 'google',
        iat: 1,
        exp: 9999999999
      })
    } as unknown as JwtTokenService;
    const guard = new BearerAuthGuard(jwtTokenService);
    const request: Record<string, unknown> = {
      headers: {
        authorization: 'Bearer app-token'
      }
    };

    const canActivate = guard.canActivate(createExecutionContext(request));

    expect(canActivate).toBe(true);
    expect(request.user).toEqual({
      id: 'user-1',
      email: 'user@example.com',
      provider: 'google'
    });
  });

  it('should reject when authorization header is missing', () => {
    const jwtTokenService = {
      verifyAccessToken: jest.fn()
    } as unknown as JwtTokenService;
    const guard = new BearerAuthGuard(jwtTokenService);

    expect(() =>
      guard.canActivate(createExecutionContext({ headers: {} }))
    ).toThrow(UnauthorizedException);
  });
});
