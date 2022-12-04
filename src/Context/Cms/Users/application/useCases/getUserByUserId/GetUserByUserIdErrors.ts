import { Result } from '../../../../../Shared/core/Result';
import { UseCaseError } from '../../../../../Shared/core/UseCaseError';

export namespace GetUserByUserNameErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No user with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
