import { typeReport_6 } from '../../types/typeReport_6';
import { report } from './report';
import { calculateBestHours } from './calculateBestHour';

enum chatResult { completed = 'completed', missed = 'missed' };


class report_3 extends report {

    protected result: typeReport_6;
    protected temp = {
        averageResponseRate_6: 0,
        averageResponseRate_6_count: 0,
        totalDuration: 0,
        countServedCalls: 0,
        countPercentageOfImmediateResponse_22: 0,
        countServiceLevel_5: 0,
        totalAverageTimeToAbandon_9: 0,
    };
    protected total = 0;
    protected numberOfCustomersWaitingForTheOperatorResponseTime = 20; // в секундах, для расчета показателя nn_2 'Коллисчество клиентов ожидавших ответа оператора более столькото секунд'
    protected timeForImmediateResponsePercentage = 2; // в секундах, для расчета параметра "Процент немедленного ответа".
    protected uniqueId: string[] = [];
    protected completedId: string[] = [];           // массив id чатов которые завершены
    protected numberOfSecondsToCalculateServiceLevel = 10; // в секундах, колличество секунд для расчета показателя "Уровень обслуживания"
    private CalculateBestHours: calculateBestHours;



    constructor() {
        super();
        this.result = this.initalizeResult();

    }

    public go(data: any, { date1, date2 }: { date1: string, date2: string }) {
        this.date1 = date1;
        this.date2 = date2;
        this.data = data;
        // console.log(data);
        this.CalculateBestHours = new calculateBestHours(date1, date2);

        this.filteredChatsByResult();



        this.completedLoop();
        this.abandonLoop();
        this.finalCalculations();

        // TODO закаментировал два нижних для настроки нового метода filteredChatsByResults()
        // this.loop();
        // this.finalCalculations();

        // console.log('uniqueId: ', this.uniqueId.length);
        // this.data.map(chat => {
        //     console.log(chat.created_at);
        // });

        return { total: this.total, result: this.result };
    }

    protected completedLoop() {

        for (const _chat of Object.keys(this.completed)) {
            let chat = this.completed[_chat];
            // console.log('chat: ', chat);
            // console.log(new Date(chat.created_at).toLocaleDateString() + ' | ' + new Date(chat.created_at).toLocaleTimeString());
            this.calculateServedCalls_2(chat);
            this.prepareCalculateAverageResponseRate_6(chat);
            this.prepareCalculateAverageTalkTime_11(chat);
            this.calculateMaximumResponseDelay_7(chat);
            this.calculatNumberOfCustomersWaitingForTheOperatorResponse_nn2(chat);
            this.preparePercentageOfImmediateResponse_22(chat);
            this.prepareServiceLevel_5(chat);
            this.CalculateBestHours.findInIntervals(chat.created_at);

            // if (new Date(chat.created_at).toLocaleTimeString() === '17:55:38') console.log(chat);
        }
    }

    protected abandonLoop() {
        for (const _chat of Object.keys(this.missed)) {
            let chat = this.missed[_chat];
            //console.log(new Date(chat.created_at).toLocaleDateString() + ' | ' + new Date(chat.created_at).toLocaleTimeString());

            this.calculateAbandonedCalls_4(chat);
            this.prepareAverageTimeToAbandon_9(chat);
        }
    }

    // protected filteredChatsByResult() {
    //     for (const chat of this.data) {
    //         let result = chat.result;
    //         let id = chat.id.split(':')[0];

    //         if (result === chatResult.completed) {
    //             if (typeof this.missed[id] !== 'undefined') {
    //                 delete this.missed[id];
    //             }
    //             this.completed[id] = chat;
    //         } else if (result === chatResult.missed) {
    //             if (typeof this.completed[id] !== 'undefined') delete this.completed[id];

    //             this.missed[id] = chat;
    //         }
    //     }
    // }

    protected calculateForLeads(chat: any) {
        if (chat.type === 'form' || chat.type === 'callback') {
            if (chat.result === 'completed' && typeof chat.closed_at !== 'undefined') {
                this.result.$servedCalls_2++;
                this.total++;
            }

            const closed_at = chat.closed_at;

            if (chat.result === 'missed' && closed_at) {
                const created_at = chat.created_at;

                const diffInSeconds = this.calculateTimeUntilChatIsReset(created_at, closed_at);
                this.temp.totalAverageTimeToAbandon_9 += diffInSeconds;
            }

            if (chat.result === 'missed' && chat.is_closed && typeof chat.closed_at !== 'undefined') {

                this.result.$abandonedCalls_4++;
                this.total++;
            }
        }

    }

    protected calculateServedCalls_2(chat: any) {
        if (chat.result === 'completed' && chat.is_closed && typeof chat.closed_at !== 'undefined') {
            this.result.$servedCalls_2++;
            this.total++;
        } else if (chat.result === 'completed' && chat.type) {
            this.result.$servedCalls_2++;
            this.total++;
        } else if (chat.result === 'completed') {
            this.result.$servedCalls_2++;
            this.total++;
        }
    }

    protected calculatNumberOfCustomersWaitingForTheOperatorResponse_nn2(chat: any) {
        if (chat.type) return;
        if (chat.first_answer_time >= this.numberOfCustomersWaitingForTheOperatorResponseTime)
            this.result.$numberOfCustomersWaitingForTheOperatorResponse_nn2++;
    }

    protected calculateMaximumResponseDelay_7(chat: any) {
        if (chat.type) return;
        if (chat.first_answer_time > this.result.$maximumResponseDelay_7) this.result.$maximumResponseDelay_7 = chat.first_answer_time;
    }

    protected prepareCalculateAverageTalkTime_11(chat: any) {

        if (chat.result === 'completed' && chat.is_closed && typeof chat.closed_at !== 'undefined') { this.temp.countServedCalls++; }
        if (chat.type) return;
        if (chat.duration) this.temp.totalDuration += chat.duration;

    }

    protected preparePercentageOfImmediateResponse_22(chat: any) {
        if (chat.type) return;
        if (chat.first_answer_time && (chat.first_answer_time <= this.timeForImmediateResponsePercentage)) {
            this.temp.countPercentageOfImmediateResponse_22++;
        }
    }

    protected prepareServiceLevel_5(chat: any) {
        if (chat.type) return;
        if (chat.first_answer_time <= this.numberOfSecondsToCalculateServiceLevel) {
            this.temp.countServiceLevel_5++;
        }
    }

    protected prepareAverageTimeToAbandon_9(chat: any) {
        if (chat.type) return;
        const closed_at = chat.closed_at;

        if (chat.result === 'missed' && chat.is_closed && closed_at) {
            const created_at = chat.created_at;

            const diffInSeconds = this.calculateTimeUntilChatIsReset(created_at, closed_at);
            this.temp.totalAverageTimeToAbandon_9 += diffInSeconds;
        }
    }



    protected prepareCalculateAverageResponseRate_6(chat: any) {
        if (chat.type) return;
        if (chat.first_answer_time) this.temp.averageResponseRate_6 += chat.first_answer_time;
        // this.temp.averageResponseRate_6 += chat.answer_time_avg;

        // console.log('chat.first_answer_time: ', chat.first_answer_time);
        // console.log('chat.answer_time_avg: ', chat.answer_time_avg);
    }

    protected calculateAverageNumberOfCallPerHour_20() {
        const hours = this.calculateTheDifferenceInSecondsBetweenDatesInHours();

        let result = 0;
        if (hours > 0) result = this.result.$servedCalls_2 / hours

        return this.numberFix(result);
    }

    protected calculateAverageServiceTime_10() {
        return this.result.$averageTalkTime_11 + this.result.$averageResponseRate_6;
    }

    protected calculateAbandonedCalls_4(chat: any) {
        // console.log('chat.result: ', chat.result);
        if (chat.result === 'missed') {
            // if (chat.result === 'missed' && chat.is_closed && typeof chat.closed_at !== 'undefined') {
            // if (chat.result === 'missed' && chat.is_closed) {
            // if (chat.result === 'missed') {
            // console.log(new Date(chat.created_at).toLocaleDateString() + ' | ' + new Date(chat.created_at).toLocaleTimeString());
            // console.log(chat);
            this.result.$abandonedCalls_4++;
            this.total++;
        }
    }

    protected loop() {
        for (const chat of this.data) {
            // if (!this.isUniqueChat(chat.id)) continue;
            if (this.isChatCompleted(chat)) continue;

            this.calculateServedCalls_2(chat);
            this.calculateAbandonedCalls_4(chat);
            this.prepareAverageTimeToAbandon_9(chat);

            this.calculateForLeads(chat);
            if (chat.result === 'completed') {
                this.prepareCalculateAverageResponseRate_6(chat);
                this.prepareCalculateAverageTalkTime_11(chat);
                this.calculateMaximumResponseDelay_7(chat);
                this.calculatNumberOfCustomersWaitingForTheOperatorResponse_nn2(chat);
                this.preparePercentageOfImmediateResponse_22(chat);
                this.prepareServiceLevel_5(chat);
                this.CalculateBestHours.findInIntervals(chat.created_at);
            }

            // console.log(new Date(chat.created_at).toLocaleDateString() + ' | ' + new Date(chat.created_at).toLocaleTimeString());
            // if (new Date(chat.created_at).toLocaleTimeString() === '13:26:41') {
            //     console.log(chat);
            // }
        }
    }

    protected finalCalculations = () => {
        if (this.temp.countServedCalls > 0) {

            this.result.$averageResponseRate_6 = Math.floor(this.temp.averageResponseRate_6 / this.temp.countServedCalls);
            this.result.$averageTalkTime_11 = Math.floor(this.temp.totalDuration / this.temp.countServedCalls);

            this.result.$percentageOfImmediateResponse_22 = this.numberFix((this.temp.countPercentageOfImmediateResponse_22 * 100) / this.temp.countServedCalls);

            this.result.$serviceLevel_5 = this.numberFix(this.temp.countServiceLevel_5 / (this.result.$abandonedCalls_4 + this.result.$servedCalls_2) * 100);
        }
        if (this.result.$abandonedCalls_4 > 0) {

            this.result.$averageTimeToAbandon_9 = this.numberFix(this.temp.totalAverageTimeToAbandon_9 / this.result.$abandonedCalls_4, 0);
        }

        this.result.$averageServiceTime_10 = this.calculateAverageServiceTime_10();
        this.result.$averageNumberOfCallPerHour_20 = this.calculateAverageNumberOfCallPerHour_20();

        const bestHour = this.CalculateBestHours.calculate();
        this.result.$numberOfCallsPerBusyHour_21 = bestHour.$numberOfCallsPerBusyHour_21;
        this.result.$datetimeOfCallsPerBusyHour_nn1 = bestHour.$datetimeOfCallsPerBusyHour_nn1;

        this.result.$queueName = 'liveTex';
        // console.log(this.CalculateBestHours.bestHours);
    }

    protected isUniqueChat(_id: string) {
        let id = _id.split(':')[0];
        if (this.uniqueId.includes(id)) {
            return false
        } else {
            this.uniqueId.push(id);
            return true;
        }
    }

    protected isChatCompleted(chat) {
        let id = chat.id.split(':')[0];
        let result = chat.result;
        // if (id === '49390247-c862-4fb9-b9c9-b793ae3bccaa') console.log(chat);
        // console.log('chat.id: ', chat.id);
        // console.log('chat.result: ', chat.result);
        // console.log('id: ', id);
        if (this.completedId.includes(id)) {
            if (result === 'missed') return false;
            return true
        } else {
            if (chat.result === 'completed' || chat.result === 'missed') {
                this.completedId.push(id);
                return false;
            }
            return true;
        }
    }

    protected initalizeResult() {
        return {
            $abandonedCalls_4: 0,
            $averageNumberOfCallPerHour_20: 0,
            $averagePostCallTime_13: 0,
            $averageResponseRate_6: 0,
            $averageServiceTime_10: 0,
            $averageTalkTime_11: 0,
            $averageTimeToAbandon_9: 0,
            $datetimeOfCallsPerBusyHour_nn1: {
                date: '',
                finish: '',
                start: ''
            },
            $maximumResponseDelay_7: 0,
            $numberOfCallsPerBusyHour_21: 0,
            $numberOfCustomersWaitingForTheOperatorResponse_nn2: 0,
            $percentageOfImmediateResponse_22: 0,
            $servedCalls_2: 0,
            $serviceLevel_5: 0,
            $queueName: ''
        };
    }

}

export { report_3 }