import { UpdateUserErrors } from './UpdateUserErrors';
import { AppError } from '../../../../../Shared/core/AppError';
import { Either, Result } from '../../../../../Shared/core/Result';

export type UpdateUserResponse = Either<
  | UpdateUserErrors.EmailAlreadyExistsError
  | UpdateUserErrors.UsernameTakenError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;
