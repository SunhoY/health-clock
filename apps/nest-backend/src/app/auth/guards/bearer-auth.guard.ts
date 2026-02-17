import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtTokenService } from '../jwt-token.service';
import { type AuthenticatedUser } from '../types/authenticated-user.type';

interface RequestLike {
  headers?: Record<string, string | string[] | undefined>;
  user?: AuthenticatedUser;
}

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestLike>();
    const authorization = this.getAuthorizationHeader(request);

    if (!authorization) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header.');
    }

    const payload = this.jwtTokenService.verifyAccessToken(token);
    request.user = {
      id: payload.sub,
      email: payload.email,
      provider: payload.provider
    };

    return true;
  }

  private getAuthorizationHeader(request: RequestLike): string | undefined {
    const raw = request.headers?.authorization;
    if (!raw) {
      return undefined;
    }

    if (Array.isArray(raw)) {
      return raw[0];
    }

    return raw;
  }
}
