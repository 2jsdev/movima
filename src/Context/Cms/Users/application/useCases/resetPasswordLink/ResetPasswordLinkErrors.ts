import { Result } from '../../../../../Shared/core/Result';
import { UseCaseError } from '../../../../../Shared/core/UseCaseError';

export namespace ResetPasswordLinkErrors {
  export class EmailNotFoundError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `Email ${email} not found`,
      } as UseCaseError);
    }
  }
}
