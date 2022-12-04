import { injectable, inject } from 'inversify';
import { DeleteUserDTO } from './DeleteUserDTO';
import { DeleteUserErrors } from './DeleteUserErrors';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { DeleteUserResponse } from './DeleteUserResponse';
import { TYPES } from '../../../infrastructure/constants/types';

@injectable()
export class DeleteUserUseCase implements UseCase<DeleteUserDTO, Promise<DeleteUserResponse>> {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  public async execute(request: DeleteUserDTO): Promise<any> {
    try {
      const user = await this.userRepository.getUserByUserId(request.id);
      const userFound = !!user === true;

      if (!userFound) {
        return left(new DeleteUserErrors.UserNotFoundError());
      }

      user.delete();

      await this.userRepository.save(user);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
