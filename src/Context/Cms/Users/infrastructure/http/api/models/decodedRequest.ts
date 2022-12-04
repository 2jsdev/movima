import * as express from 'express';
import { JWTClaims } from '../../../../domain/Jwt';

export type DecodedExpressRequest = express.Request & {
  body: {
    decoded: JWTClaims;
  };
};
