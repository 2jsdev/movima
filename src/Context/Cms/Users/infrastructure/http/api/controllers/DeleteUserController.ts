import { inject } from 'inversify';
import { Response } from 'express';
import { controller, httpDelete } from 'inversify-express-utils';
import { DeleteUserUseCase } from '../../../../application/useCases/deleteUser/DeleteUserUseCase';
import { DeleteUserDTO } from '../../../../application/useCases/deleteUser/DeleteUserDTO';
import { DeleteUserErrors } from '../../../../application/useCases/deleteUser/DeleteUserErrors';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { DecodedExpressRequest } from '../models/decodedRequest';
import { TYPES } from '../../../constants/types';
import isAuthenticated from '../../../../../../Shared/infrastructure/http/api/middlewares/isAuthenticated';
import isAuthorized from '../../../../../../Shared/infrastructure/http/api/middlewares/isAuthorized';

@controller('/api/collections')
export class DeleteUserController extends BaseController {
  constructor(@inject(TYPES.DeleteUserUseCase) private useCase: DeleteUserUseCase) {
    super();
  }

  @httpDelete('/users/records/:id', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'], isOwner: true }))
  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
    const dto: DeleteUserDTO = req.params as DeleteUserDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteUserErrors.UserNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res);
      }
    } catch (error) {
      return this.fail(res, error);
    }
  }
}
