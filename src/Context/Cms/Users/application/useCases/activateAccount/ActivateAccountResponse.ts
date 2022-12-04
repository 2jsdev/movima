import { User } from '../../../domain/User';
import { ActivateAccountErrors } from './ActivateAccountErrors';
import { AppError } from '../../../../../Shared/core/AppError';
import { Either, Result } from '../../../../../Shared/core/Result';

export type ActivateAccountResponse = Either<
  ActivateAccountErrors.TokenNotFoundError | AppError.UnexpectedError,
  Result<void>
>;
