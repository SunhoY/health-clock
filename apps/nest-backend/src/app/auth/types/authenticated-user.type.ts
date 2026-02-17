export interface AuthenticatedUser {
  id: string;
  email: string;
  provider: 'google';
}

export interface AppAccessTokenPayload {
  sub: string;
  email: string;
  provider: 'google';
  iat: number;
  exp: number;
}
