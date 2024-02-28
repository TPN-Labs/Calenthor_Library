import { logger } from '../utils';
import { LIBRARY_NAME } from '../config';

export class EventOverlapsError extends Error {
    private readonly _logger = logger.child({ _library: LIBRARY_NAME });

    constructor(message: string = 'Event overlaps with another event.') {
        super(message);
        this._logger.error(message);
        this.name = 'EventOverlapsError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EventOverlapsError);
        }
    }
}
