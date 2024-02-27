import { RecurrenceFrequency } from '../../types';

export class RecurrenceRule {
    private readonly _frequency: RecurrenceFrequency;
    private readonly _interval: number;
    private readonly _count: number | null;
    private _endDate: Date | null;

    /**
     * RecurrenceRule constructor
     * @param frequency
     * @param interval - The interval of the recurrence (every `interval` days/weeks/months)
     * @param count - The maximum number of occurrences, or null if there is no limit if endDate is also null
     * @param endDate - The end date of the recurrence, or null if there is no end date
     */
    constructor(
        frequency: RecurrenceFrequency,
        interval: number,
        count: number | null,
        endDate: Date | null,
    ) {
        this._frequency = frequency;
        this._interval = interval;
        this._count = count;
        this._endDate = endDate;
    }

    get frequency(): RecurrenceFrequency {
        return this._frequency;
    }

    get interval(): number {
        return this._interval;
    }

    get count(): number | null {
        return this._count;
    }

    get endDate(): Date | null {
        return this._endDate;
    }

    set endDate(endDate: Date | null) {
        this._endDate = endDate;
    }
}
