import { inject } from 'inversify';
import { Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { LoginUserUseCase } from '../../../../application/useCases/login/LoginUseCase';
import { LoginDTO, LoginDTOResponse } from '../../../../application/useCases/login/LoginDTO';
import { LoginUseCaseErrors } from '../../../../application/useCases/login/LoginErrors';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { DecodedExpressRequest } from './../models/decodedRequest';
import { TYPES } from '../../../constants/types';

@controller('/api/auth')
export class LoginController extends BaseController {
  constructor(@inject(TYPES.LoginUserUseCase) private useCase: LoginUserUseCase) {
    super();
  }

  @httpPost('/login')
  async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
    const dto: LoginDTO = req.body as LoginDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case LoginUseCaseErrors.UserNameDoesntExistError:
            return this.notFound(res, error.getErrorValue().message);
          case LoginUseCaseErrors.PasswordDoesntMatchError:
            return this.clientError(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const dto: LoginDTOResponse = result.value.getValue() as LoginDTOResponse;
        return this.ok<LoginDTOResponse>(res, dto);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
