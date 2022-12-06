import { injectable, inject } from 'inversify';
import { ResetPasswordDTO } from './ResetPasswordDTO';
import { ResetPasswordErrors } from './ResetPasswordErrors';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { ResetPasswordResponse } from './ResetPasswordResponse';
import { TYPES } from '../../../infrastructure/constants/types';
import { UserPassword } from '../../../domain/UserPassword';

@injectable()
export class ResetPasswordUseCase implements UseCase<ResetPasswordDTO, Promise<ResetPasswordResponse>> {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(request: ResetPasswordDTO): Promise<ResetPasswordResponse> {
    try {
      const user = await this.userRepository.findOne({ reset_password_token: request.resetPasswordToken });
      const userFound = !!user === true;

      if (!userFound) {
        return left(new ResetPasswordErrors.TokenNotFoundError(request.resetPasswordToken)) as ResetPasswordResponse;
      }

      const passwordOrError = UserPassword.create({ value: request.password });
      if (passwordOrError.isFailure) {
        return left(Result.fail<any>(passwordOrError.getErrorValue().toString())) as ResetPasswordResponse;
      }

      const password = passwordOrError.getValue();

      user.changePassword(password);

      await this.userRepository.update(user);
      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as ResetPasswordResponse;
    }
  }
}
