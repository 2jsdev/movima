import { DeleteUserErrors } from './DeleteUserErrors';
import { Either, Result } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';

export type DeleteUserResponse = Either<AppError.UnexpectedError | DeleteUserErrors.UserNotFoundError, Result<void>>;
