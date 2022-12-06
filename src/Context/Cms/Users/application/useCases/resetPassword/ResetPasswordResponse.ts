import { ResetPasswordErrors } from './ResetPasswordErrors';
import { AppError } from '../../../../../Shared/core/AppError';
import { Either, Result } from '../../../../../Shared/core/Result';

export type ResetPasswordResponse = Either<
  ResetPasswordErrors.TokenNotFoundError | AppError.UnexpectedError,
  Result<void>
>;
