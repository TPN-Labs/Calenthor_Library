import { Duration } from '../models';
import { DateRange } from '../../types';
import { EventRepository } from '../../repositories';

export class CalendarService {
    private eventRepository = new EventRepository();

    // TODO: Remove the eslint-disable-next-line comment
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createEvent(title: string, start: Date, duration: Duration, allowOverlap: boolean = false) {
        // TODO: Complete this method
    }

    // TODO: Remove the eslint-disable-next-line comment
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    listEvents(range: DateRange) {
        // TODO: Complete this method
    }

    // TODO: Remove the eslint-disable-next-line comment
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateEvent(id: string, title: string, start: Date, duration: Duration, allowOverlap: boolean = false) {
        // TODO: Complete this method
    }

    // TODO: Remove the eslint-disable-next-line comment
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteEvent(id: string) {
        // TODO: Complete this method
    }
}
