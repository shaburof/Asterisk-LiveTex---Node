import { Request } from 'express';
import { access_ip } from '../server';

class util {
    protected static getIp(req: Request) {
        return req.connection.remoteAddress as string;
    }

    public static checkIpAccess(req: Request) {
        let ip = util.getIp(req);
        return ip.includes(access_ip) || ip.includes('10.5.4.3');
    }
}

export { util };