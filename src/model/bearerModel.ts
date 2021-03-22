import { model } from './model';
// import { livetexController } from '../controllers/livetexController';
import { livetex } from '../service/livetex/livetex';
import { getData, getToken } from '../service/helpers';

class bearer extends model {

    protected token;


    constructor() {
        super();
        this.token = this.getBearer();
    }

    protected async getBearer<T>() {
        return new Promise<{ _id: any, access_token: string, expired_in: number }>((resolve, reject) => {
            try {
                let res = this.findOne<{ _id: any, access_token: string, expired_in: number }>('token', {});
                resolve(res);
            }
            catch (e) {
                reject(e);
            }
        });
    }

    protected async isValid() {

        let { _id, access_token, expired_in } = await this.getBearer();
        let nodeDate = Number.parseInt(expired_in.toString() + '000');

        let now = new Date();
        let expired_inDate = new Date(nodeDate);

        let result = true;
        if (expired_in === 0) result = false;
        if (now >= expired_inDate) result = false;

        return result;
    }

    public async getToken(): Promise<{ _id: any; access_token: string; expired_in: number; }> {
        let { _id, access_token, expired_in } = await this.getBearer();

        if (await this.isValid()) {
            return await this.token;
        }
        else {
            await this.recreateToken();
            this.token = this.getBearer();
            return this.token;
        }
    }

    protected async recreateToken() {
        let { results: { access_token, token_type, expires_in } } = await livetex.getToken();
        let newAccessToken = access_token;
        let newExpitedIn = expires_in;

        let { _id, access_token: access_tokenOld, expired_in } = await this.getBearer();
        let findId = await this.findOne<{ _id }>('token', { _id: _id });
        let id = findId._id;

        let update = await this.updateOne('token', { _id: id }, { $set: { access_token: newAccessToken, expired_in: newExpitedIn } })
    }

}

export { bearer };

// let br = new bearer();
// (async () => {
//     let token = await br.getToken();
//     console.log('token: ', token.access_token);
// })()