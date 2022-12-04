import { User } from './../../domain/User';
import { JWTClaims, JWTToken, RefreshToken } from '../../domain/Jwt';
import { VerificationToken } from '../../domain/VerificationToken';

export interface AuthService {
  signJWT(props: JWTClaims): JWTToken;
  decodeJWT(token: string): Promise<JWTClaims>;
  createRefreshToken(): RefreshToken;
  getTokens(username: string): Promise<string[]>;
  saveAuthenticatedUser(user: User): Promise<void>;
  deAuthenticateUser(username: string): Promise<void>;
  refreshTokenExists(refreshToken: RefreshToken): Promise<boolean>;
  getUserNameFromRefreshToken(refreshToken: RefreshToken): Promise<string>;

  // createActivationToken(): Promise<VerificationToken>
}
