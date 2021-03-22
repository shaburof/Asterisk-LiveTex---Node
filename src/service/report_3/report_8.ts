import { report } from './report';

class report_8 extends report {

    private operators: any = {};
    protected uniqueId: string[] = [];

    constructor() {
        super();
    }


    public go = (data: any, { date1, date2 }: { date1: string, date2: string }) => {
        this.date1 = date1;
        this.date2 = date2;
        this.data = data;

        this.filteredChatsByResult();

        this.loop();
        return this.operators;
    }

    private loop() {
        for (const _chat of Object.keys(this.completed)) {
            let chat = this.completed[_chat];
            if (typeof chat.employee === 'undefined' || chat.employee.length === 0) continue;
            if (chat.result.toLowerCase() !== 'completed' || chat.duration === null) continue;

            const { duration, operatorName } = this.getOperatorProperties(chat);

            if (!this.operators[operatorName]) this.operators[operatorName] = { onlineChatHours_32: duration };
            else this.operators[operatorName].onlineChatHours_32 += duration;
        }
    }

    private getOperatorProperties = (chat: any) => {
        const { duration } = chat;
        const { first_name, last_name } = chat.employee[0];

        const operatorName = `${last_name} ${first_name[0]}`;

        return { duration, operatorName };
    }

    // protected isUniqueChat(_id: string) {
    //     let id = _id.split(':')[0];
    //     if (this.uniqueId.includes(id)) {
    //         return false
    //     } else {
    //         this.uniqueId.push(id);
    //         return true;
    //     }
    // }

}

export { report_8 };
