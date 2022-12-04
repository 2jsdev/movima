import { Either } from '../../../../../Shared/core/Result';
import { Result } from '../../../../../Shared/core/Result';
import { AppError } from '../../../../../Shared/core/AppError';
import { LoginUseCaseErrors } from './LoginErrors';
import { LoginDTOResponse } from './LoginDTO';

export type LoginResponse = Either<
  LoginUseCaseErrors.PasswordDoesntMatchError | LoginUseCaseErrors.UserNameDoesntExistError | AppError.UnexpectedError,
  Result<LoginDTOResponse>
>;
