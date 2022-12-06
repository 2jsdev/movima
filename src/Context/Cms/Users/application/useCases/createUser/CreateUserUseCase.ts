import { injectable, inject } from 'inversify';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUserErrors } from './CreateUserErrors';
import { left, Result, right } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UseCase } from '../../../../../Shared/core/UseCase';
import { User } from '../../../domain/User';
import { UserEmail } from '../../../domain/UserEmail';
import { UserName } from '../../../domain/UserName';
import { UserPassword } from '../../../domain/UserPassword';
import { CreateUserResponse } from './CreateUserResponse';
import { TYPES } from '../../../infrastructure/constants/types';
import { Role } from '../../../domain/role';

@injectable()
export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<CreateUserResponse>> {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(request: CreateUserDTO): Promise<CreateUserResponse> {
    const emailOrError = UserEmail.create(request.email);
    const passwordOrError = UserPassword.create({ value: request.password });
    const usernameOrError = UserName.create({ value: request.username });

    const dtoResult = Result.combine([emailOrError, passwordOrError, usernameOrError]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.getErrorValue())) as CreateUserResponse;
    }

    const email: UserEmail = emailOrError.getValue();
    const password: UserPassword = passwordOrError.getValue();
    const username: UserName = usernameOrError.getValue();
    const role: Role = request.role;

    try {
      const userAlreadyExists = await this.userRepository.exists(email);

      if (userAlreadyExists) {
        return left(new CreateUserErrors.EmailAlreadyExistsError(email.value)) as CreateUserResponse;
      }

      try {
        const alreadyCreatedUserByUserName = await this.userRepository.search({ username: username.value.toString() });

        const userNameTaken = !!alreadyCreatedUserByUserName === true;

        if (userNameTaken) {
          return left(new CreateUserErrors.UsernameTakenError(username.value)) as CreateUserResponse;
        }
      } catch (error) {}

      const userOrError: Result<User> = User.create({
        email,
        password,
        username,
        role,
      });

      if (userOrError.isFailure) {
        return left(Result.fail<User>(userOrError.getErrorValue().toString())) as CreateUserResponse;
      }

      const user: User = userOrError.getValue();

      await this.userRepository.save(user);

      return right(Result.ok<User>(user));
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as CreateUserResponse;
    }
  }
}
