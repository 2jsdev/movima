import { injectable, inject } from 'inversify';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { AuthService } from '../../services/authService';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { LogoutDTO } from './LogoutDTO';
import { AppError } from '../../../../../Shared/core/AppError';
import { User } from '../../../domain/User';
import { LogoutErrors } from './LogoutErrors';
import { LogoutResponse } from './LogoutResponse';
import { TYPES } from '../../../infrastructure/constants/types';

@injectable()
export class LogoutUseCase implements UseCase<LogoutDTO, Promise<LogoutResponse>> {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
  ) {}

  public async execute(request: LogoutDTO): Promise<LogoutResponse> {
    let user: User;
    const { userId } = request;

    try {
      try {
        user = await this.userRepository.getUserByUserId(userId);
      } catch (err) {
        return left(new LogoutErrors.UserNotFoundOrDeletedError());
      }

      await this.authService.deAuthenticateUser(user.username.value);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
