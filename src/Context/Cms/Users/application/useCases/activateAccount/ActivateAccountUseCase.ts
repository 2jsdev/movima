import { injectable, inject } from 'inversify';
import { ActivateAccountDTO } from './ActivateAccountDTO';
import { ActivateAccountErrors } from './ActivateAccountErrors';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { ActivateAccountResponse } from './ActivateAccountResponse';
import { TYPES } from '../../../infrastructure/constants/types';

@injectable()
export class ActivateAccountUseCase implements UseCase<ActivateAccountDTO, Promise<ActivateAccountResponse>> {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(request: ActivateAccountDTO): Promise<ActivateAccountResponse> {
    try {
      const user = await this.userRepository.findOne({ activation_token: request.token });
      const userFound = !!user === true;

      if (!userFound) {
        return left(new ActivateAccountErrors.TokenNotFoundError(request.token)) as ActivateAccountResponse;
      }

      user.verifyEmail();

      await this.userRepository.update(user);
      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as ActivateAccountResponse;
    }
  }
}
