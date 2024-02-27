export class EventOverlapsError extends Error {
    constructor(message: string = 'Event overlaps with another event.') {
        super(message);
        this.name = 'EventNotFoundError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EventOverlapsError);
        }
    }
}
