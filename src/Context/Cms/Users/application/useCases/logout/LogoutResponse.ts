import { Either } from '../../../../../Shared/core/Result';
import { Result } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';

export type LogoutResponse = Either<AppError.UnexpectedError, Result<void>>;
