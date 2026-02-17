import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  type AppAccessTokenPayload,
  type AuthenticatedUser
} from './types/authenticated-user.type';

interface JwtHeader {
  alg: 'HS256';
  typ: 'JWT';
}

interface IssueTokenResult {
  accessToken: string;
  expiresIn: number;
}

@Injectable()
export class JwtTokenService {
  private readonly defaultExpiresInSeconds = 60 * 60;

  issueAccessToken(user: AuthenticatedUser): IssueTokenResult {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresIn = this.resolveExpiresInSeconds();

    const payload: AppAccessTokenPayload = {
      sub: user.id,
      email: user.email,
      provider: user.provider,
      iat: issuedAt,
      exp: issuedAt + expiresIn
    };

    return {
      accessToken: this.sign(payload),
      expiresIn
    };
  }

  verifyAccessToken(token: string): AppAccessTokenPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid bearer token.');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const expectedSignature = this.signWithHmac(
      `${encodedHeader}.${encodedPayload}`,
      this.resolveJwtSecret()
    );

    const actualSignatureBuffer = Buffer.from(encodedSignature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);
    if (actualSignatureBuffer.length !== expectedSignatureBuffer.length) {
      throw new UnauthorizedException('Invalid bearer token.');
    }

    if (!timingSafeEqual(actualSignatureBuffer, expectedSignatureBuffer)) {
      throw new UnauthorizedException('Invalid bearer token.');
    }

    const payload = this.parsePayload(encodedPayload);

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Expired bearer token.');
    }

    return payload;
  }

  private sign(payload: AppAccessTokenPayload): string {
    const header: JwtHeader = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeader = this.encodeBase64Url(JSON.stringify(header));
    const encodedPayload = this.encodeBase64Url(JSON.stringify(payload));
    const signature = this.signWithHmac(
      `${encodedHeader}.${encodedPayload}`,
      this.resolveJwtSecret()
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private parsePayload(encodedPayload: string): AppAccessTokenPayload {
    try {
      const parsed = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf-8')
      ) as Partial<AppAccessTokenPayload>;

      if (
        typeof parsed.sub !== 'string' ||
        typeof parsed.email !== 'string' ||
        parsed.provider !== 'google' ||
        typeof parsed.iat !== 'number' ||
        typeof parsed.exp !== 'number'
      ) {
        throw new UnauthorizedException('Invalid bearer token payload.');
      }

      return {
        sub: parsed.sub,
        email: parsed.email,
        provider: parsed.provider,
        iat: parsed.iat,
        exp: parsed.exp
      };
    } catch {
      throw new UnauthorizedException('Invalid bearer token payload.');
    }
  }

  private signWithHmac(content: string, secret: string): string {
    return createHmac('sha256', secret).update(content).digest('base64url');
  }

  private encodeBase64Url(raw: string): string {
    return Buffer.from(raw, 'utf-8').toString('base64url');
  }

  private resolveJwtSecret(): string {
    return (
      process.env.JWT_SECRET ??
      process.env.AUTH_JWT_SECRET ??
      'development-auth-secret'
    );
  }

  private resolveExpiresInSeconds(): number {
    const raw = process.env.AUTH_JWT_EXPIRES_IN;
    if (!raw) {
      return this.defaultExpiresInSeconds;
    }

    const normalized = raw.trim().toLowerCase();
    const match = /^(\d+)(s|m|h|d)?$/.exec(normalized);

    if (!match) {
      return this.defaultExpiresInSeconds;
    }

    const amount = Number(match[1]);
    const unit = match[2] ?? 's';

    switch (unit) {
      case 's':
        return amount;
      case 'm':
        return amount * 60;
      case 'h':
        return amount * 60 * 60;
      case 'd':
        return amount * 60 * 60 * 24;
      default:
        return this.defaultExpiresInSeconds;
    }
  }
}
