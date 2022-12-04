import { Request, Response, Next } from 'express';
import { endRequest } from '../utils/endRequest';

type Options = {
  hasRole: Array<'USER' | 'ADMIN'>;
  isOwner?: boolean;
};

export default (opts: Options) => {
  return (req: Request, res: Response, next: Next) => {
    const { userId, role } = req.decoded;
    const { id } = req.params;

    if (opts.isOwner && id && userId === id) return next();

    if (opts.hasRole.includes(role)) return next();

    return endRequest(403, 'Forbidden', res);
  };
};
