import { injectable, inject } from 'inversify';
import { ResendActivationLinkDTO } from './ResendActivationLinkDTO';
import { ResendActivationLinkErrors } from './ResendActivationLinkErrors';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { ResendActivationLinkResponse } from './ResendActivationLinkResponse';
import { TYPES } from '../../../infrastructure/constants/types';

@injectable()
export class ResendActivationLinkUseCase implements UseCase<ResendActivationLinkDTO, Promise<ResendActivationLinkResponse>> {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(request: ResendActivationLinkDTO): Promise<ResendActivationLinkResponse> {
    try {
      const user = await this.userRepository.findOne({ user_email: request.email });
      const userFound = !!user === true;

      if (!userFound) {
        return left(new ResendActivationLinkErrors.EmailNotFoundError(request.email)) as ResendActivationLinkResponse;
      }
      // check if account is already verified
      if (user.isEmailVerified) {
        return left(
          new ResendActivationLinkErrors.AccountIsAlreadyVerifiedError(request.email),
        ) as ResendActivationLinkResponse;
      }

      user.setActivationToken();
      
      await this.userRepository.update(user);
      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as ResendActivationLinkResponse;
    }
  }
}
