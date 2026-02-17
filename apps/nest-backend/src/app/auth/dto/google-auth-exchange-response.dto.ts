export interface GoogleAuthExchangeResponseDto {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
  scope: string;
  tokenType: string;
  idToken?: string;
}
