import { CreateUserErrors } from './CreateUserErrors';
import { AppError } from '../../../../../Shared/core/AppError';
import { Either, Result } from '../../../../../Shared/core/Result';

export type CreateUserResponse = Either<
  | CreateUserErrors.EmailAlreadyExistsError
  | CreateUserErrors.UsernameTakenError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;
