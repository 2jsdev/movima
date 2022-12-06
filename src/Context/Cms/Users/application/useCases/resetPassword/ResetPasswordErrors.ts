import { Result } from '../../../../../Shared/core/Result';
import { UseCaseError } from '../../../../../Shared/core/UseCaseError';

export namespace ResetPasswordErrors {
  export class TokenNotFoundError extends Result<UseCaseError> {
    constructor(token: string) {
      super(false, {
        message: `Token ${token} not found`,
      } as UseCaseError);
    }
  }
}
