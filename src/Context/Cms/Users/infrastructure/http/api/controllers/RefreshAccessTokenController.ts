import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { BaseController } from '../../../../../../Shared/infrastructure/http/api/models/BaseController';
import { RefreshAccessTokenUseCase } from '../../../../application/useCases/refreshAccessToken/RefreshAccessTokenUseCase';
import { RefreshAccessTokenDTO } from '../../../../application/useCases/refreshAccessToken/RefreshAccessTokenDTO';
import { RefreshAccessTokenErrors } from '../../../../application/useCases/refreshAccessToken/RefreshAccessTokenErrors';
import { JWTToken } from '../../../../domain/Jwt';
import { LoginDTOResponse } from '../../../../application/useCases/login/LoginDTO';
import { TYPES } from '../../../constants/types';

@controller('/api/auth')
export class RefreshAccessTokenController extends BaseController {
  constructor(@inject(TYPES.RefreshAccessTokenUseCase) private useCase: RefreshAccessTokenUseCase) {
    super();
  }

  @httpPost('/refresh-access-token')
  async executeImpl(req: Request, res: Response): Promise<any> {
    const dto: RefreshAccessTokenDTO = req.body as RefreshAccessTokenDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case RefreshAccessTokenErrors.RefreshTokenNotFound:
            return this.notFound(res, error.getErrorValue().message);
          case RefreshAccessTokenErrors.UserNotFoundOrDeletedError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(res, error.getErrorValue().message);
        }
      } else {
        const accessToken: JWTToken = result.value.getValue() as JWTToken;
        return this.ok<LoginDTOResponse>(res, {
          refreshToken: dto.refreshToken,
          accessToken: accessToken,
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
