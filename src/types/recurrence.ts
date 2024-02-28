import { RecurrenceFrequency } from './recurrenceFrequency';

/**
 * PeriodicityRule constructor
 * @param frequency
 * @param interval - The interval of the recurrence (every `interval` days/weeks/months)
 * @param count - The maximum number of occurrences, or null if there is no limit if endDate is also null
 * @param endDate - The end date of the recurrence, or null if there is no end date
 */
export type PeriodicityRule = {
    frequency: RecurrenceFrequency;
    interval: number;
    count: number | null;
    endDate: Date | null;
}
