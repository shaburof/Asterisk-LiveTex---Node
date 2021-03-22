import { bestTimeType } from '../../types/typeReport_6';
class calculateBestHours {

    private date1Object: Date;
    private date2Object: Date;
    private intervals: { date1: Date, date2: Date }[] = [];
    private bestHour: { count: number, date: string, start: string, finish: string } = { count: 0, date: '', start: '', finish: '' };
    public bestHours: { [prod: string]: { count: number, date: string, start: string, finish: string } } = {};
    private result: bestTimeType = { $numberOfCallsPerBusyHour_21: 0, $datetimeOfCallsPerBusyHour_nn1: { date: '', start: '', finish: '' } };

    // dataCount: number;
    // next: Date;
    // prev: Date;



    constructor(private date1: string, private date2: string) {
        this.date1Object = new Date(this.date1);
        this.date2Object = new Date(this.date2);

        this.calculateIntervals();
    }

    public calculate() {
        this.findBestHour();

        return this.result;
    }

    private calculateIntervals() {
        const next = new Date(this.date1);
        const prev = new Date(this.date1);
        let doIndex = 0;
        do {
            this.addToNextStep(next);
            let interval: { date1: Date, date2: Date } = { date1: new Date(), date2: new Date() };
            if (next < this.date2Object) {
                interval = { date1: new Date(prev.getTime()), date2: new Date(next.getTime()) };
            } else {
                interval = { date1: new Date(prev.getTime()), date2: new Date(this.date2Object.getTime()) };
                this.intervals.push(interval);
                break;
            }
            this.intervals.push(interval);
            this.addToNextStep(prev);
            doIndex++;
            if (doIndex > 5000) throw new Error('error, 5000 loop is too match...');
        } while (next < this.date2Object)
    }

    public findInIntervals = (created_at: string) => {
        const chatTime = new Date(created_at);
        for (const itervalTime of this.intervals) {
            const { date1, date2 } = itervalTime;

            if (chatTime >= date1 && chatTime <= date2) {
                if (!this.bestHours[date1.toISOString()]) {
                    this.bestHours[date1.toISOString()] = this.getBestHour(date1, date2);
                } else {
                    this.bestHours[date1.toISOString()].count++;
                }
            }
        }
    }

    private getBestHour = (date1: Date, date2: Date) => {
        let start = date1.toLocaleTimeString();
        start = start.substr(0, start.length - 3);
        let finish = date2.toLocaleTimeString();
        finish = finish.substr(0, finish.length - 3);

        return { count: 1, date: date1.toLocaleDateString(), start: start, finish: finish }
    }

    private findBestHour = () => {
        Object.keys(this.bestHours).forEach(dt => {
            let { count, date, start, finish } = this.bestHours[dt];
            // console.log(this.bestHours[dt]);
            // console.log('count: ', count);
            // console.log('-----------------');
            if (count > this.bestHour.count) this.bestHour = { count, date, start, finish };
        });

        this.result.$numberOfCallsPerBusyHour_21 = this.bestHour.count;
        this.result.$datetimeOfCallsPerBusyHour_nn1.date = this.bestHour.date;
        this.result.$datetimeOfCallsPerBusyHour_nn1.start = this.bestHour.start;
        this.result.$datetimeOfCallsPerBusyHour_nn1.finish = this.bestHour.finish
    }

    private addToNextStep = (step: Date | null) => {
        if (step === null) throw new Error('step doent can be NULL');
        step.setHours(step.getHours() + 1);
        step.setMinutes(0);
        step.setSeconds(0);
    }

}

export { calculateBestHours };