import { Result } from '../../../../../Shared/core/Result';
import { UseCaseError } from '../../../../../Shared/core/UseCaseError';

export namespace ResendActivationLinkErrors {
  export class EmailNotFoundError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `Email ${email} not found`,
      } as UseCaseError);
    }
  }
  export class AccountIsAlreadyVerifiedError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The account associated with the email ${email} is already verified`,
      } as UseCaseError);
    }
  }
}
