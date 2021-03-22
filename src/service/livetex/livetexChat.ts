import { Request, Response } from 'express';
import { fakeData } from '../../dev/fakeData';
import { sendError, queryListIsValid } from '../helpers';
import { livetex } from './livetex';
import dotenv from 'dotenv';
dotenv.config();

class livetexChat extends livetex {

    protected tzOffset = 5;
    private chats: any;
    protected uniqueId: string[] = [];
    private getOnlyUniqueIdChats = false;
    private TZ_OFFSET = +(process.env.TZ_OFFSET as string);

    constructor() {
        super();
    }



    public list = async (req: Request, res: Response) => {
        if (!queryListIsValid(req)) {
            throw new Error('invalid fields, right: <apiaddress>/date1=2020-09-20 00:00:00&date2=2020-09-20 23:59:59');
            // return sendError(res, 'invalid fields, right: <apiaddress>/date1=2020-09-20&date2=2020-09-20');
        }

        const { date1, date2, date1Object, date2Object } = this.parseDate(req);
        // console.log('date1: ', date1);
        // console.log('date2: ', date2);
        // console.log('date1Object: ', date1Object);
        // console.log('date2Object: ', date2Object);

        let chats = await this.getChatsLocal(date1, date2);
        // console.log('chats: ', chats.length);

        // let chats = fakeData.results;
        // TODO тут fakeData

        this.chats = chats;

        this.sortChats();
        const splitingChats = this.splitChatsByTimeAndSortNotUnique({ date1Object, date2Object, getOnlyUniqueIdChats: this.getOnlyUniqueIdChats });

        return splitingChats;

    }

    private isRepeatedId(_id: string) {
        let id = _id.split(':')[0];
        if (this.uniqueId.includes(id)) {
            return true
        } else {
            this.uniqueId.push(id);
            return false;
        }
    }

    private splitChatsByTimeAndSortNotUnique({ date1Object, date2Object, getOnlyUniqueIdChats }: { date1Object: Date, date2Object: Date, getOnlyUniqueIdChats: boolean }) {

        const sortchats: any[] = [];

        for (const chat of this.chats) {

            if (getOnlyUniqueIdChats && this.isRepeatedId(chat.id)) continue;

            const created_at = new Date(chat.created_at);

            if (created_at >= date1Object && created_at <= date2Object) {
                // console.log('created_at >= date1Object: ', created_at);
                sortchats.push(chat);
            }
            // else {
            //     console.log('created_at < date1Object: ', created_at);
            // }
            if (created_at > date2Object) break;
        }

        return sortchats;
    }

    private sortChats() {
        this.chats.sort((a: any, b: any) => {
            if (a.created_at > b.created_at) return 1;
            else if (a.created_at < b.created_at) return -1;
            else return 0;
        });
    }

    private setDateWithOffset(date: string) {
        let temp = new Date(date);
        let offset = this.TZ_OFFSET * 60000;
        let timeInMiliseconds = temp.getTime() + offset;
        let temp2 = new Date(timeInMiliseconds);

        return temp2;
    }

    private parseDate(req: Request) {
        let { date1, date2 } = req.body;
        date1 = date1 as string;
        date2 = date2 as string;


        // const date1Object = new Date(date1);
        const date1Object = this.setDateWithOffset(date1)
        // const date2Object = new Date(date2);
        const date2Object = this.setDateWithOffset(date2);
        date1 = date1.split(' ')[0];
        date2 = date2.split(' ')[0];

        let date1MinusDay = new Date(date1);
        date1MinusDay.setDate(date1MinusDay.getDate() - 1);
        date1 = date1MinusDay.toISOString().split('T')[0];

        return { date1, date2, date1Object, date2Object };
    }

}

export { livetexChat };

