import { injectable, inject } from 'inversify';
import { UpdateUserDTO } from './UpdateUserDTO';
import { UpdateUserErrors } from './UpdateUserErrors';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { User } from '../../../domain/User';
import { UserEmail } from '../../../domain/UserEmail';
import { UserName } from '../../../domain/UserName';
import { UpdateUserResponse } from './UpdateUserResponse';
import { TYPES } from '../../../infrastructure/constants/types';

@injectable()
export class UpdateUserUseCase implements UseCase<UpdateUserDTO, Promise<UpdateUserResponse>> {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(request: UpdateUserDTO): Promise<UpdateUserResponse> {
    let userFound: User;
    let email: UserEmail;
    let username: UserName;

    try {
      try {
        userFound = await this.userRepository.getUserByUserId(request.id);
      } catch (error) {
        return left(new UpdateUserErrors.UserNotFoundError(request.id));
      }

      if (request.hasOwnProperty('email')) {
        const emailOrError: Result<UserEmail> = UserEmail.create(request.email);
        if (emailOrError.isFailure) {
          return left(Result.fail<any>(emailOrError.getErrorValue().toString())) as UpdateUserResponse;
        }

        email = emailOrError.getValue();
        if (userFound.email.value !== request.email) {
          const userFound = await this.userRepository.findOne({ user_email: email.value.toString() });

          if (!!userFound) {
            return left(new UpdateUserErrors.EmailAlreadyExistsError(request.email)) as UpdateUserResponse;
          }
        }
      }

      if (request.hasOwnProperty('username')) {
        const usernameOrError: Result<UserName> = UserName.create({ value: request.username });
        if (usernameOrError.isFailure) {
          return left(Result.fail<any>(usernameOrError.getErrorValue().toString())) as UpdateUserResponse;
        }

        username = usernameOrError.getValue();
        if (userFound.username.value !== request.username) {
          const userFound = await this.userRepository.findOne({ username: username.value.toString() });

          if (!!userFound) {
            return left(new UpdateUserErrors.EmailAlreadyExistsError(request.username)) as UpdateUserResponse;
          }
        }
      }

      const userProps = {
        ...userFound.props,
        ...request,
        ...(email && { email }),
        ...(username && { username }),
      };

      const userOrError = User.create(userProps, userFound.id);
      const user: User = userOrError.getValue();

      await this.userRepository.update(user);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
