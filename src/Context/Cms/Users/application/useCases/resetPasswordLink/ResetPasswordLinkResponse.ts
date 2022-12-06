import { ResetPasswordLinkErrors } from './ResetPasswordLinkErrors';
import { AppError } from '../../../../../Shared/core/AppError';
import { Either, Result } from '../../../../../Shared/core/Result';

export type ResetPasswordLinkResponse = Either<
  ResetPasswordLinkErrors.EmailNotFoundError | AppError.UnexpectedError,
  Result<void>
>;
