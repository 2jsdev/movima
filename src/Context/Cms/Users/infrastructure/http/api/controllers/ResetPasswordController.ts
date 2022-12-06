import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { ResetPasswordUseCase } from '../../../../application/useCases/resetPassword/ResetPasswordUseCase';
import { ResetPasswordDTO } from '../../../../application/useCases/resetPassword/ResetPasswordDTO';
import { ResetPasswordErrors } from '../../../../application/useCases/resetPassword/ResetPasswordErrors';
import { TYPES } from '../../../constants/types';

@controller('/api/auth')
export class ResetPasswordController extends BaseController {
  constructor(@inject(TYPES.ResetPasswordUseCase) private useCase: ResetPasswordUseCase) {
    super();
  }

  @httpPost('/reset-password')
  async executeImpl(req: Request, res: Response): Promise<any> {
    let dto: ResetPasswordDTO = req.body as ResetPasswordDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ResetPasswordErrors.TokenNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res, {
          message: "Your password has been successfully updated. Please go to the Login Page to Sign In again",
        });
      }
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
