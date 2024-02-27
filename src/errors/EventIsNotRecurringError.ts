import { logger } from '../utils';
import { LIBRARY_NAME } from '../config';

export class EventIsNotRecurringError extends Error {
    private readonly _logger = logger.child({ _library: LIBRARY_NAME });

    constructor(message: string = 'Event is not recurring') {
        super(message);
        this._logger.error(message);
        this.name = 'EventNotFoundError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EventIsNotRecurringError);
        }
    }
}
