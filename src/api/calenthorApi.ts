import { CalendarService } from '../domain/services';
import { Duration } from '../domain/models';
import { DateRange } from '../types';

export class CalenthorApi {
    private calendarService = new CalendarService();

    createEvent(title: string, start: Date, duration: Duration, allowOverlap: boolean = false) {
        return this.calendarService.createEvent(title, start, duration, allowOverlap);
    }

    listEvents(range: DateRange) {
        return this.calendarService.listEvents(range);
    }

    updateEvent(id: string, title: string, start: Date, duration: Duration, allowOverlap: boolean = false) {
        return this.calendarService.updateEvent(id, title, start, duration, allowOverlap);
    }

    deleteEvent(id: string) {
        return this.calendarService.deleteEvent(id);
    }
}
