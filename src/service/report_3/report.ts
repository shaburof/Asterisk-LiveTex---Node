enum chatResult { completed = 'completed', missed = 'missed' };

class report {

    protected data: any[];
    protected date1: string;
    protected date2: string;
    protected tzOffset = 5;
    protected completed: { [proc: string]: any } = {};
    protected missed: { [proc: string]: any } = {};

    protected filteredChatsByResult() {

        this.sortChartById();
        let testId = 'qwe';
        for (const chat of this.data) {

            let result = chat.result;
            let id = chat.id.split(':')[0];

            if (result === chatResult.completed && chat.closed_at !== '') {
                if (typeof this.missed[id] !== 'undefined') {
                    // console.log(chat);
                    if (this.missed[id].duration === null && this.missed[id].first_answer_time === null) {
                        if (id === testId) console.log(1);
                        if (new Date(this.missed[id].created_at) < new Date(chat.created_at)) delete this.missed[id];
                    } else {
                        if (id === testId) console.log(2);
                        if (new Date(this.missed[id].created_at) < new Date(chat.created_at)) delete this.missed[id];
                    }
                }

                if (typeof this.completed[id] === 'undefined' && chat.closed_at !== '') {
                    this.completed[id] = chat;
                }

                // console.log('id === testId: ', id === testId);
                if (id === testId) {
                    console.log('completed');
                    console.log(chat);
                    console.log(typeof this.completed[id]);
                    console.log(typeof this.missed[id]);
                    console.log(chat.employee);
                }
                // if (typeof chat.employee !== 'undefined' && chat.employee.length === 0) {
                //     console.log(chat);
                // }
            } else if (result === chatResult.missed && chat.closed_at !== '') {
                if (typeof this.completed[id] !== 'undefined') {
                    delete this.completed[id];
                    if (id === testId) console.log(3);
                    if (chat.duration !== null && chat.first_answer_time !== null) {
                        if (id === testId) console.log(4);
                        // console.log(4);
                        this.missed[id] = chat;
                    }
                    // else if (chat.employee.length === 0) {
                    //     if (id === testId) console.log(6);
                    //     this.missed[id] = chat;
                    // }
                }
                else {
                    this.missed[id] = chat;
                    if (id === testId) console.log(5);
                }
                // console.log(chat);
                // console.log(typeof this.completed[id]);
                // console.log(typeof this.missed[id]);
                if (id === testId) {
                    console.log('missed');
                    console.log(chat);
                    console.log(typeof this.completed[id]);
                    console.log(typeof this.missed[id]);
                    console.log(chat.employee);
                }
            }
        }
        // console.log('-----------------');
        // console.log(this.missed);
    }

    protected sortChartById() {
        this.data.sort((a, b) => {
            let aId = a.id;
            let bId = b.id;
            if (aId > bId) return 1;
            if (aId < bId) return -1;
            return 0;
        });
    }

    protected calculateTheDifferenceInSecondsBetweenDatesInHours() {
        const datesDifference = this.getDateDifferenceInSeconds(this.date1, this.date2);


        return Math.ceil(datesDifference / 60 / 60);
    }

    private getDateDifferenceInSeconds(date1: string, date2: string) {
        const dateSeconds1 = new Date(date1).getTime() / 1000;
        const dateSeconds2 = new Date(date2).getTime() / 1000;

        const datesDifference = dateSeconds2 - dateSeconds1;

        return datesDifference;
    }

    protected numberFix = (value: number, countAfterDot = 1) => {
        // console.log('value: ', value);
        return Number.parseFloat((value).toFixed(countAfterDot))
    }

    protected calculateTimeUntilChatIsReset(date1: string, date2: string) {
        const date2Object = new Date(date2);
        date2Object.setHours(date2Object.getHours() + this.tzOffset);
        let date1String = date1.split('.')[0];
        let date2String = date2Object.toISOString().replace('T', ' ').split('.')[0];


        return this.getDateDifferenceInSeconds(date1String, date2String);
    }
}

export { report }