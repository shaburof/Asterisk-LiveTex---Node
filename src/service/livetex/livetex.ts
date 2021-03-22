import { bearer } from '../../model/bearerModel';
import dotenv from 'dotenv';
import { getToken, sendError, getData, queryListIsValid, getQueryLine, getLeadsQueryLine } from '../helpers';
dotenv.config();

class livetex {

    private static email = process.env.LIVETEX_NAME as string;
    private static password = process.env.LIVETEX_PASSWORD as string;
    private static endpoint = {
        hostname: 'web-api.livetex.ru',
        path: '/oauth2/token',
        getChatPath: '/chats/list?q=created_at=',
        getChatPathRange: '/chats/list?q=created_at='
    };
    // private fields = '';
    private fields = process.env.LIVETEX_QUERYLINE as string;
    private offset = 50;
    private result: any[] = [];
    private Bearer: bearer;

    constructor() {
        this.Bearer = new bearer();
    }

    static async getToken() {
        let { hostname, path } = livetex.endpoint;
        let options = {
            username: livetex.email,
            password: livetex.password,
            hostname: hostname,
            path: path
        };
        let token = await getToken<{ "results": { "access_token": string, "token_type": string, "expires_in": number } }>(options);


        return token;
    }

    saveResult(data) {
        this.result = [...this.result, ...data];
    }
    getChatsLocal = async (date1: string, date2: string) => {
        await this.getChatsRequest(date1, date2);
        await this.getLeadsRequest(date1, date2);

        return this.result;
    }


    getChatsRequest = async (date1: string, date2: string) => {
        // let totalResult: any[] = [];

        let { _id, access_token, expired_in } = await this.Bearer.getToken();

        let offset = 0;
        let numberOfPasses: number;


        const requestToLiveTexData = await this.requestToLiveTex2(date1, date2, offset, access_token);
        const requestToLiveTexResult = requestToLiveTexData.results;
        const requestToLiveTexTotal = requestToLiveTexData.total;
        // totalResult = [...totalResult, ...requestToLiveTexResult];
        this.saveResult(requestToLiveTexResult);


        numberOfPasses = Math.ceil(requestToLiveTexTotal / this.offset);

        if (numberOfPasses > 1) {
            do {
                numberOfPasses--;

                offset++;

                const requestToLiveTexData = await this.requestToLiveTex2(date1, date2, offset, access_token);
                const requestToLiveTexResult = requestToLiveTexData.results;

                // totalResult = [...totalResult, ...requestToLiveTexResult];
                this.saveResult(requestToLiveTexResult);

            } while (numberOfPasses !== 0)
        }

        // return this.result;
    }

    getLeadsRequest = async (date1: string, date2: string) => {
        // let totalResult: any[] = [];

        try {
            let { _id, access_token, expired_in } = await this.Bearer.getToken();

            let offset = 0;
            let numberOfPasses: number;


            const requestToLiveTexData = await this.requestToLiveTex2(date1, date2, offset, access_token, false);
            // console.log('requestToLiveTexData: ', requestToLiveTexData);
            const requestToLiveTexResult = requestToLiveTexData.results;
            const requestToLiveTexTotal = requestToLiveTexData.total;
            // totalResult = [...totalResult, ...requestToLiveTexResult];
            this.saveResult(requestToLiveTexResult);
            // console.log('requestToLiveTexResult: ', requestToLiveTexResult);


            numberOfPasses = Math.ceil(requestToLiveTexTotal / this.offset);

            if (numberOfPasses > 1) {
                do {
                    numberOfPasses--;
                    offset++;

                    const requestToLiveTexData = await this.requestToLiveTex2(date1, date2, offset, access_token);
                    const requestToLiveTexResult = requestToLiveTexData.results;

                    // totalResult = [...totalResult, ...requestToLiveTexResult];
                    this.saveResult(requestToLiveTexResult);

                } while (numberOfPasses !== 0)
            }

            // return this.result;
        } catch (e) {
            console.log(e);
            return { status: false, message: e.message, code: e.code };
        }
    }


    private requestToLiveTex2 = async (date1: string, date2: string, offset: number, access_token: string, chat = true) => {
        const options = {
            hostname: livetex.endpoint.hostname,
            port: 443,
            path: chat ? getQueryLine(date1, date2, offset * this.offset, this.fields) : getLeadsQueryLine(date1, date2, offset * this.offset, this.fields),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token,
            },
        }

        try {
            let result = await getData<string>(options);

            let json = JSON.parse(result);
            return json;
        } catch (err) {
            throw new Error(err);
        }
    }

}

export { livetex };