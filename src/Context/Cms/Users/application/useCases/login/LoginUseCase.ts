import { injectable, inject } from 'inversify';
import { LoginDTO, LoginDTOResponse } from './LoginDTO';
import { LoginUseCaseErrors } from './LoginErrors';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { AuthService } from '../../services/authService';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { User } from '../../../domain/User';
import { UserName } from '../../../domain/UserName';
import { UserPassword } from '../../../domain/UserPassword';
import { JWTToken, RefreshToken } from '../../../domain/Jwt';
import { LoginResponse } from './LoginResponse';
import { TYPES } from '../../../infrastructure/constants/types';

@injectable()
export class LoginUserUseCase implements UseCase<LoginDTO, Promise<LoginResponse>> {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
  ) {}

  public async execute(request: LoginDTO): Promise<LoginResponse> {
    let user: User;
    let username: UserName;
    let password: UserPassword;

    try {
      const usernameOrError = UserName.create({ value: request.username });
      const passwordOrError = UserPassword.create({ value: request.password });
      const payloadResult = Result.combine([usernameOrError, passwordOrError]);

      if (payloadResult.isFailure) {
        return left(Result.fail<any>(payloadResult.getErrorValue()));
      }

      username = usernameOrError.getValue();
      password = passwordOrError.getValue();

      user = await this.userRepository.search({ username: username.value.toString() });
      const userFound = !!user;

      if (!userFound) {
        return left(new LoginUseCaseErrors.UserNameDoesntExistError());
      }

      const passwordValid = await user.password.comparePassword(password.value);

      if (!passwordValid) {
        return left(new LoginUseCaseErrors.PasswordDoesntMatchError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        username: user.username.value,
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        userId: user.userId.id.toString(),
        role: user.role,
      });

      const refreshToken: RefreshToken = this.authService.createRefreshToken();

      user.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user);

      return right(
        Result.ok<LoginDTOResponse>({
          accessToken,
          refreshToken,
        }),
      );
    } catch (error) {
      return left(new AppError.UnexpectedError(error.toString()));
    }
  }
}
