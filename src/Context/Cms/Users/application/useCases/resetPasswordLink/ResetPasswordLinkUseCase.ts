import { injectable, inject } from 'inversify';
import { ResetPasswordLinkDTO } from './ResetPasswordLinkDTO';
import { ResetPasswordLinkErrors } from './ResetPasswordLinkErrors';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { ResetPasswordLinkResponse } from './ResetPasswordLinkResponse';
import { TYPES } from '../../../infrastructure/constants/types';

@injectable()
export class ResetPasswordLinkUseCase implements UseCase<ResetPasswordLinkDTO, Promise<ResetPasswordLinkResponse>> {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(request: ResetPasswordLinkDTO): Promise<ResetPasswordLinkResponse> {
    try {
      const user = await this.userRepository.findOne({ user_email: request.email });
      const userFound = !!user === true;

      if (!userFound) {
        return left(new ResetPasswordLinkErrors.EmailNotFoundError(request.email)) as ResetPasswordLinkResponse;
      }

      user.setResetPasswordToken();

      await this.userRepository.update(user);
      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as ResetPasswordLinkResponse;
    }
  }
}
