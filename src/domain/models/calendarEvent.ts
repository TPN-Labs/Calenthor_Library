import { Duration } from './duration';

export class CalendarEvent {
    constructor(
        public id: string,
        public title: string,
        public start: Date,
        public duration: Duration,
        // eslint-disable-next-line no-empty-function
    ) {}

    get end(): Date {
        return new Date(this.start.getTime() + this.duration.value);
    }
}
