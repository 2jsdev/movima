
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpGet } from 'inversify-express-utils';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { GetUserByUserIdUseCase } from "../../../../application/useCases/getUserByUserId/GetUserByUserIdUseCase";
import { GetUserByUserIdDTO } from '../../../../application/useCases/getUserByUserId/GetUserByUserIdDTO';
import { GetUserByUserNameErrors } from '../../../../application/useCases/getUserByUserId/GetUserByUserIdErrors';
import { UserMapper } from '../../../persistence/sequelize/UserMapper';
import { TYPES } from '../../../constants/types';

@controller('/api/collections')
export class GetUserByUserIdController extends BaseController {
  constructor(@inject(TYPES.GetUserByUserIdUseCase) private useCase: GetUserByUserIdUseCase) {
    super();
  }

  @httpGet('/users/records/:id')
  async executeImpl (req: Request, res: Response): Promise<any> {
    const dto: GetUserByUserIdDTO = req.params as GetUserByUserIdDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
  
        switch (error.constructor) {
          case GetUserByUserNameErrors.UserNotFoundError:
            return this.notFound(res, error.getErrorValue().message)
          default:
            return this.fail(res, error.getErrorValue().message);
        }
        
      } else {
        const user = result.value.getValue();
        return this.ok(res, {
          user: UserMapper.toDTO(user),
        });
      }

    } catch (err) {
      return this.fail(res, err)
    }
  }
}