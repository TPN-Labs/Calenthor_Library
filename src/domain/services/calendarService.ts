import { Duration } from '../models';
import { DateRange } from '../../types';
import { EventRepository } from '../../repositories';

export class CalendarService {
    private eventRepository = new EventRepository();

    createEvent(title: string, start: Date, duration: Duration, allowOverlap: boolean = false) {
        // TODO: Complete this method
    }

    listEvents(range: DateRange) {
        // TODO: Complete this method
    }

    updateEvent(id: string, title: string, start: Date, duration: Duration, allowOverlap: boolean = false) {
        // TODO: Complete this method
    }

    deleteEvent(id: string) {
        // TODO: Complete this method
    }
}
