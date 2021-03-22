import https from 'https';
import { Request, Response } from 'express';
import FormData from 'form-data';

export const sendError = (res: Response, message: string = '') => {
    return res.json({ status: 'error', message: message })
}

export const getData = <T>(options:
    {
        hostname: string, port: number, path: string, method: string, headers: {}
    }) => {
    return new Promise<T>((resolve, reject) => {
        let data: any = '';
        const req = https.request(options, (res) => {
            //console.log(`statusCode: ${res.statusCode}`)

            if (res.statusCode === 401) {
                return reject({ status: false, code: 401, message: 'The supplied authentication is invalid' });
            }

            res.on('data', (chank) => {
                data += chank;
            })

            res.on('end', () => {
                //  console.log(JSON.parse(data));
                resolve(data);
            });
        })

        req.on('error', (error) => {
            return reject({ status: false, message: error.message, stack: error });
        })

        req.end()
    });
}

export const getToken = <T>(params: { username: string, password: string, hostname: string, path: string }) => {

    return new Promise<T>((resolve, reject) => {
        let data: any = '';
        const form = new FormData();
        form.append('grant_type', 'password');
        form.append('username', params.username);
        form.append('password', params.password);
        const options = {
            hostname: params.hostname,
            port: 443,
            path: params.path,
            method: 'POST',
            headers: form.getHeaders()
        };


        const req = https.request(options, (res) => {
            if (res.statusCode === 401) {
                return reject({ status: false, code: 401, message: 'The supplied authentication is invalid' });
            }


            res.on('data', (chank) => {
                data += chank;
            })

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        })

        req.on('error', (error) => {
            return reject({ status: false, message: error.message, stack: error });
        });

        form.pipe(req);
        req.end();
    });
}


export const testRegData = (data: string) => {
    return !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(data);
    // return !/\d{4}-\d{2}-\d{2}/.test(data);
}

export const dateIsValid = (data: string) => {
    return new Date(data).getTime() === new Date(data).getTime();
}

export const queryListIsValid = (req: Request) => {
    let { date1, date2 } = req.body;
    date1 = date1 as string;
    date2 = date2 as string;

    if (!date1 || !date2 || testRegData(date1) || testRegData(date2) || !dateIsValid(date1) || !dateIsValid(date2)) {
        return false;
    }

    return true;
}

export const getQueryLine = (date1: string, date2: string, offset: number, fields: string) => {
    return `/chats/list?offset=${offset}&q=created_at>=${date1}%20created_at<=${date2}&${fields}`;
}

export const getLeadsQueryLine = (date1: string, date2: string, offset: number, fields: string) => {
    return `/leads/list?offset=${offset}&q=created_at>=${date1}%20created_at<=${date2}&${fields}`;
}

