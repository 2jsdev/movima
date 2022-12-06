import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { ResendActivationLinkUseCase } from '../../../../application/useCases/resendActivationLink/ResendActivationLinkUseCase';
import { ResendActivationLinkDTO } from '../../../../application/useCases/resendActivationLink/ResendActivationLinkDTO';
import { ResendActivationLinkErrors } from '../../../../application/useCases/resendActivationLink/ResendActivationLinkErrors';
import { TYPES } from '../../../constants/types';

@controller('/api/auth')
export class ResendActivationLinkController extends BaseController {
  constructor(@inject(TYPES.ResendActivationLinkUseCase) private useCase: ResendActivationLinkUseCase) {
    super();
  }

  @httpPost('/resend-activation-link')
  async executeImpl(req: Request, res: Response): Promise<any> {
    let dto: ResendActivationLinkDTO = req.body as ResendActivationLinkDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ResendActivationLinkErrors.EmailNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          case ResendActivationLinkErrors.AccountIsAlreadyVerifiedError:
            return this.conflict(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res, {
          message: 'Activation Link has been sent',
        });
      }
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
