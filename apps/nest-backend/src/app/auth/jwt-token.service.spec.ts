import { UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
  const originalDateNow = Date.now;

  beforeEach(() => {
    process.env.JWT_SECRET = 'unit-test-secret';
    process.env.AUTH_JWT_EXPIRES_IN = '1h';
  });

  afterEach(() => {
    Date.now = originalDateNow;
    delete process.env.JWT_SECRET;
    delete process.env.AUTH_JWT_EXPIRES_IN;
  });

  it('should issue and verify access token', () => {
    Date.now = jest.fn(() => 1_700_000_000_000);
    const service = new JwtTokenService();

    const issued = service.issueAccessToken({
      id: 'user-1',
      email: 'user@example.com',
      provider: 'google'
    });
    const payload = service.verifyAccessToken(issued.accessToken);

    expect(issued.expiresIn).toBe(3600);
    expect(payload.sub).toBe('user-1');
    expect(payload.email).toBe('user@example.com');
    expect(payload.provider).toBe('google');
  });

  it('should reject expired token', () => {
    const service = new JwtTokenService();
    Date.now = jest.fn(() => 1_700_000_000_000);
    process.env.AUTH_JWT_EXPIRES_IN = '1s';
    const issued = service.issueAccessToken({
      id: 'user-1',
      email: 'user@example.com',
      provider: 'google'
    });

    Date.now = jest.fn(() => 1_700_000_000_000 + 2_000);

    expect(() => service.verifyAccessToken(issued.accessToken)).toThrow(
      UnauthorizedException
    );
  });
});
