import { Duration } from './duration';
import { PeriodicityRule } from '../../types';

export class CalendarEvent {
    private readonly _id: string;
    private _title: string;
    private _start: Date;
    private _duration: Duration;
    private _allowOverlap: boolean = false;
    private _recurrenceRule?: PeriodicityRule;

    /**
     * CalendarEvent constructor
     * @param id - The unique identifier of the event
     * @param title - The title of the event
     * @param start - The start date of the event
     * @param duration - The duration of the event
     * @param allowOverlap - Whether the event is allowed to overlap with other events
     * @param recurrenceRule - The recurrence rule of the event, or undefined if the event does not recur
     */
    constructor(
        id: string,
        title: string,
        start: Date,
        duration: Duration,
        allowOverlap?: boolean,
        recurrenceRule?: PeriodicityRule,
    ) {
        this._id = id;
        this._title = title;
        this._start = start;
        this._duration = duration;
        this._allowOverlap = allowOverlap ?? false;
        this._recurrenceRule = recurrenceRule;
    }

    get end(): Date {
        return new Date(this._start.getTime() + this._duration.value);
    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        this._title = title;
    }

    get start(): Date {
        return this._start;
    }

    set start(start: Date) {
        this._start = start;
    }

    get duration(): Duration {
        return this._duration;
    }

    set duration(duration: Duration) {
        this._duration = duration;
    }

    get allowOverlap(): boolean {
        return this._allowOverlap;
    }

    set allowOverlap(allowOverlap: boolean) {
        this._allowOverlap = allowOverlap;
    }

    get recurrenceRule(): PeriodicityRule | undefined {
        return this._recurrenceRule;
    }

    set recurrenceRule(recurrenceRule: PeriodicityRule | undefined) {
        this._recurrenceRule = recurrenceRule;
    }
}
