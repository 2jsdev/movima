import { JWTToken, RefreshToken } from '../../../domain/Jwt';

export interface LoginDTO {
  username: string;
  password: string;
}

export interface LoginDTOResponse {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
}
