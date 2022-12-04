import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpPatch } from 'inversify-express-utils';
import { UpdateUserUseCase } from '../../../../application/useCases/updateUser/UpdateUserUseCase';
import { UpdateUserDTO } from '../../../../application/useCases/updateUser/UpdateUserDTO';
import { UpdateUserErrors } from '../../../../application/useCases/updateUser/UpdateUserErrors';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { TYPES } from '../../../constants/types';
import isAuthenticated from '../../../../../../Shared/infrastructure/http/api/middlewares/isAuthenticated';
import isAuthorized from '../../../../../../Shared/infrastructure/http/api/middlewares/isAuthorized';

@controller('/api/collections')
export class UpdateUserController extends BaseController {
  constructor(@inject(TYPES.UpdateUserUseCase) private useCase: UpdateUserUseCase) {
    super();
  }

  @httpPatch('/users/records/:id', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'], isOwner: true }))
  async executeImpl(req: Request, res: Response): Promise<any> {
    const dto: UpdateUserDTO = req.body as UpdateUserDTO;

    try {
      const result = await this.useCase.execute({ ...dto, id: req.params.id });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UpdateUserErrors.UserNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          case UpdateUserErrors.EmailAlreadyExistsError:
            return this.conflict(res, error.getErrorValue().message);
          case UpdateUserErrors.UsernameTakenError:
            return this.conflict(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
