import { Request, Response, NextFunction } from 'express';
import { livetexChat } from '../service/livetex/livetexChat';
import { report_3 } from '../service/report_3/report_3';
import { report_8 } from '../service/report_3/report_8';
import { fakeData } from '../dev/fakeData';



class chatController {

    constructor() {
    }

    report_3 = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const LiveTextChat = new livetexChat(); let chats = await LiveTextChat.list(req, res);

            // return res.json(chats);
            // let chats = fakeData;
            const Report_3 = new report_3();

            const result = Report_3.go(chats, this.parseData(req));

            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    report_8 = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const LiveTextChat = new livetexChat();
            let chats = await LiveTextChat.list(req, res);

            const Report_8 = new report_8();

            const result = Report_8.go(chats, this.parseData(req));

            // for (const item in result) {
            //     let duration = result[item].onlineChatHours_32;
            //     console.log('item: ', item, duration);
            // }

            res.json(result);
        } catch (err) {
            next(err);
        }
    }


    protected parseData(req: Request) {
        let { date1, date2 } = req.body;
        date1 = date1 as string;
        date2 = date2 as string;

        return { date1: date1, date2: date2 };
    }
}

export { chatController };