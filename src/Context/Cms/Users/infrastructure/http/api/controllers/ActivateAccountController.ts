import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { ActivateAccountUseCase } from '../../../../application/useCases/activateAccount/ActivateAccountUseCase';
import { ActivateAccountDTO } from '../../../../application/useCases/activateAccount/ActivateAccountDTO';
import { ActivateAccountErrors } from '../../../../application/useCases/activateAccount/ActivateAccountErrors';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { TYPES } from '../../../constants/types';

@controller('/api/auth')
export class AccountActivateController extends BaseController {
  constructor(@inject(TYPES.ActivateAccountUseCase) private useCase: ActivateAccountUseCase) {
    super();
  }

  @httpPost('/account-activate')
  async executeImpl(req: Request, res: Response): Promise<any> {
    let dto: ActivateAccountDTO = req.body as ActivateAccountDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ActivateAccountErrors.TokenNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res, {
          message: 'Your account has been activated. Please proceed to the Login page to Sign In',
        });
      }
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
