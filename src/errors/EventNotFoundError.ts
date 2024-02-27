export class EventNotFoundError extends Error {
    constructor(message: string = 'Event not found.') {
        super(message);
        this.name = 'EventNotFoundError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EventNotFoundError);
        }
    }
}
