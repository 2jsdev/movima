import { injectable, inject } from 'inversify';
import { User } from './../../../domain/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UserName } from '../../../domain/UserName';

import { GetUserByUserIdDTO } from './GetUserByUserIdDTO';
import { GetUserByUserNameErrors } from './GetUserByUserIdErrors';

import { UseCase } from '../../../../../Shared/core/UseCase';
import { GetUserByUserIdResponse } from './GetUserByUserIdResponse';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { TYPES } from '../../../infrastructure/constants/types';

@injectable()
export class GetUserByUserIdUseCase implements UseCase<GetUserByUserIdDTO, Promise<GetUserByUserIdResponse>> {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  public async execute(request: GetUserByUserIdDTO): Promise<GetUserByUserIdResponse> {
    try {

      const user = await this.userRepository.getUserByUserId(request.id);
      const userFound = !!user === true;

      if (!userFound) {
        return left(new GetUserByUserNameErrors.UserNotFoundError(request.id)) as GetUserByUserIdResponse;
      }

      return right(Result.ok<User>(user));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
