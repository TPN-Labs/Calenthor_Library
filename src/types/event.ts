import { Duration } from '../domain/models';
import { PeriodicityRule } from './recurrence';

export type EventItem = {
    id?: string;
    title: string;
    start: Date;
    duration: Duration;
    allowOverlap?: boolean;
    recurrenceRule?: PeriodicityRule;
}
