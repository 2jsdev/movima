import { inject } from 'inversify';
import { Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { DecodedExpressRequest } from './../models/decodedRequest';
import { LogoutUseCase } from '../../../../application/useCases/logout/LogoutUseCase';
import { TYPES } from '../../../constants/types';
import isAuthenticated from '../../../../../../Shared/infrastructure/http/api/middlewares/isAuthenticated';

@controller('/api/auth')
export class LogoutController extends BaseController {
  constructor(@inject(TYPES.LogoutUseCase) private useCase: LogoutUseCase) {
    super();
  }

  @httpPost('/logout', isAuthenticated)
  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
    const { userId } = req.decoded;

    try {
      const result = await this.useCase.execute({ userId });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      } else {
        return this.ok(res);
      }
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
