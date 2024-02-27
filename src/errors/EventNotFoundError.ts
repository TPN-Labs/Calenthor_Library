import { logger } from '../utils';
import { LIBRARY_NAME } from '../config';

export class EventNotFoundError extends Error {
    private readonly _logger = logger.child({ _library: LIBRARY_NAME });

    constructor(message: string = 'Event not found.') {
        super(message);
        this._logger.error(message);
        this.name = 'EventNotFoundError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EventNotFoundError);
        }
    }
}
