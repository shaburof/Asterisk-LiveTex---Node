import { Request, Response, NextFunction } from 'express';
import { util } from '../util/util';


export const serviceMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let access = util.checkIpAccess(req);
    if (!access) next(new Error('access closed'));
    else next();
}