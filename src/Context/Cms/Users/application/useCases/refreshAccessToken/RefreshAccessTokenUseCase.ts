import { injectable, inject } from 'inversify';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { AuthService } from '../../services/authService';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { JWTToken } from '../../../domain/Jwt';
import { RefreshAccessTokenErrors } from './RefreshAccessTokenErrors';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/User';
import { RefreshAccessTokenDTO } from './RefreshAccessTokenDTO';
import { RefreshAccessTokenResponse } from './RefreshAccessTokenResponse';
import { TYPES } from '../../../infrastructure/constants/types';

@injectable()
export class RefreshAccessTokenUseCase implements UseCase<RefreshAccessTokenDTO, Promise<RefreshAccessTokenResponse>> {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
  ) {}

  public async execute(req: RefreshAccessTokenDTO): Promise<RefreshAccessTokenResponse> {
    const { refreshToken } = req;
    let user: User;
    let username: string;

    try {
      // Get the username for the user that owns the refresh token
      try {
        username = await this.authService.getUserNameFromRefreshToken(refreshToken);
      } catch (err) {
        return left(new RefreshAccessTokenErrors.RefreshTokenNotFound());
      }

      try {
        // get the user by username
        user = await this.userRepository.getUserByUserName(username);
      } catch (err) {
        return left(new RefreshAccessTokenErrors.UserNotFoundOrDeletedError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        userId: user.userId.id.toString(),
        username: user.username.value,
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
      });

      // sign a new jwt for that user
      user.setAccessToken(accessToken, refreshToken);

      // save it
      await this.authService.saveAuthenticatedUser(user);

      // return the new access token
      return right(Result.ok<JWTToken>(accessToken));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
