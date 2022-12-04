import { User } from './../../../domain/User';
import { Either } from '../../../../../Shared/core/Result';
import { Result } from './../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';

export type GetUserByUserIdResponse = Either<AppError.UnexpectedError, Result<User>>;
