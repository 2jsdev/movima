import { inject } from 'inversify';
import { Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { CreateUserUseCase } from '../../../../application/useCases/createUser/CreateUserUseCase';
import { CreateUserDTO } from '../../../../application/useCases/createUser/CreateUserDTO';
import { TextUtils } from '../../../../../../Shared/infrastructure/utils/TextUtils';
import { CreateUserErrors } from '../../../../application/useCases/createUser/CreateUserErrors';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { DecodedExpressRequest } from '../models/decodedRequest';
import { TYPES } from '../../../constants/types';

@controller('/api/auth')
export class RegisterController extends BaseController {
  constructor(@inject(TYPES.CreateUserUseCase) private useCase: CreateUserUseCase) {
    super();
  }

  @httpPost('/register')
  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
    let dto: CreateUserDTO = req.body as CreateUserDTO;

    dto = {
      username: TextUtils.sanitize(dto.username),
      email: TextUtils.sanitize(dto.email),
      password: dto.password,
      role: "USER",
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.UsernameTakenError:
            return this.conflict(res, error.getErrorValue().message);
          case CreateUserErrors.EmailAlreadyExistsError:
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
