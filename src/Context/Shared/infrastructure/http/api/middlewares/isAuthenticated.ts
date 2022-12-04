import { Request, Response } from 'express';
import { AuthService } from '../../../../../Cms/Users/application/services/authService';
import { TYPES } from '../../../../../Cms/Users/infrastructure/constants/types';
import { container } from '../../../ioc/container';
import { endRequest } from '../utils/endRequest';

export default async (req: Request, res: Response, next: Function) => {
  const authService = container.get<AuthService>(TYPES.AuthService);

  const token = req.headers['authorization'];

  if (token) {
    const decoded = await authService.decodeJWT(token);

    const signatureFailed = !!decoded === false;

    if (signatureFailed) {
      return endRequest(403, 'Token signature expired.', res);
    }

    // See if the token was found
    const { username } = decoded;
    const tokens = await authService.getTokens(username);

    // if the token was found, just continue the request.
    if (tokens.length !== 0) {
      req.decoded = decoded;
      return next();
    } else {
      return endRequest(403, 'Auth token not found. User is probably not logged in. Please login again.', res);
    }
  } else {
    return endRequest(403, 'No access token provided', res);
  }
};
