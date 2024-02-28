import { logger } from '../utils';
import { LIBRARY_NAME } from '../config';

export class EventRangeInvalidError extends Error {
    private readonly _logger = logger.child({ _library: LIBRARY_NAME });

    constructor(message: string = 'Event range is invalid.') {
        super(message);
        this._logger.error(message);
        this.name = 'EventRangeInvalidError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EventRangeInvalidError);
        }
    }
}
