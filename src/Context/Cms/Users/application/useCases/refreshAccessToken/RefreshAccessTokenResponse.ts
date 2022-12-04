import { Either } from '../../../../../Shared/core/Result';
import { Result } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { RefreshAccessTokenErrors } from './RefreshAccessTokenErrors';
import { JWTToken } from '../../../domain/Jwt';

export type RefreshAccessTokenResponse = Either<
  RefreshAccessTokenErrors.RefreshTokenNotFound | AppError.UnexpectedError,
  Result<JWTToken>
>;
