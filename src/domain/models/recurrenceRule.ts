import { RecurrenceFrequency } from '../../types';

export class RecurrenceRule {
    private readonly _frequency: RecurrenceFrequency;
    private readonly _interval: number;
    private readonly _endDate: Date | null;
    private readonly _count: number | null;

    /**
     * RecurrenceRule constructor
     * @param frequency
     * @param interval - The interval of the recurrence (every `interval` days/weeks/months)
     * @param endDate - The end date of the recurrence, or null if there is no end date
     * @param count - The maximum number of occurrences, or null if there is no limit if endDate is also null
     */
    constructor(
        frequency: RecurrenceFrequency,
        interval: number,
        endDate: Date | null,
        count: number | null,
    ) {
        this._frequency = frequency;
        this._interval = interval;
        this._endDate = endDate;
        this._count = count;
    }

    get frequency(): RecurrenceFrequency {
        return this._frequency;
    }

    get interval(): number {
        return this._interval;
    }

    get endDate(): Date | null {
        return this._endDate;
    }

    get count(): number | null {
        return this._count;
    }
}
