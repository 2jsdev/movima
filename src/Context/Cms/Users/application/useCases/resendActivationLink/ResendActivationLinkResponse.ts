import { ResendActivationLinkErrors } from './ResendActivationLinkErrors';
import { AppError } from '../../../../../Shared/core/AppError';
import { Either, Result } from '../../../../../Shared/core/Result';

export type ResendActivationLinkResponse = Either<
  | ResendActivationLinkErrors.EmailNotFoundError
  | ResendActivationLinkErrors.AccountIsAlreadyVerifiedError
  | AppError.UnexpectedError,
  Result<void>
>;
