import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { ResetPasswordLinkUseCase } from '../../../../application/useCases/resetPasswordLink/ResetPasswordLinkUseCase';
import { ResetPasswordLinkDTO } from '../../../../application/useCases/resetPasswordLink/ResetPasswordLinkDTO';
import { ResetPasswordLinkErrors } from '../../../../application/useCases/resetPasswordLink/ResetPasswordLinkErrors';
import { TYPES } from '../../../constants/types';

@controller('/api/auth')
export class ResetPasswordLinkController extends BaseController {
  constructor(@inject(TYPES.ResetPasswordLinkUseCase) private useCase: ResetPasswordLinkUseCase) {
    super();
  }

  @httpPost('/reset-password-link')
  async executeImpl(req: Request, res: Response): Promise<any> {
    let dto: ResetPasswordLinkDTO = req.body as ResetPasswordLinkDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ResetPasswordLinkErrors.EmailNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res, {
          message: 'Reset Password Link has been sent',
        });
      }
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
