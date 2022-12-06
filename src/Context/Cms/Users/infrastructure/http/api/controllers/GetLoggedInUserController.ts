import { inject } from 'inversify';
import { Response } from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { DecodedExpressRequest } from '../models/decodedRequest';
import { GetUserByUserIdUseCase } from '../../../../application/useCases/getUserByUserId/GetUserByUserIdUseCase';
import { UserMapper } from '../../../persistence/sequelize/UserMapper';
import isAuthenticated from '../../../../../../Shared/infrastructure/http/api/middlewares/isAuthenticated';
import { TYPES } from '../../../constants/types';

@controller('/api/auth')
export class GetLoggedInUserController extends BaseController {
  constructor(@inject(TYPES.GetUserByUserIdUseCase) private useCase: GetUserByUserIdUseCase) {
    super();
  }

  @httpGet('/logged-in-user', isAuthenticated)
  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
    const { userId } = req.decoded;

    try {
      const result = await this.useCase.execute({ id: userId });

      if (result.isLeft()) {
        return this.fail(res, result.value.getErrorValue().message);
      } else {
        const user = result.value.getValue();
        return this.ok(res, {
          user: UserMapper.toDTO(user),
        });
      }
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
