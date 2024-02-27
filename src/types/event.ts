import { Duration, RecurrenceRule } from '../domain/models';

export type EventItem = {
    id?: string;
    title: string;
    start: Date;
    duration: Duration;
    recurrenceRule?: RecurrenceRule;
}
