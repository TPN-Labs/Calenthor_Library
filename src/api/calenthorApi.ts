import { CalendarService } from '../domain/services';
import { CalendarEvent } from '../domain/models';
import { DateRange, EventItem } from '../types';

interface ICalenthorApi {
    createEvent(event: EventItem): void;

    listEvents(range: DateRange): CalendarEvent[];

    updateEvent(event: EventItem): CalendarEvent;

    deleteEvent(id: string): boolean;

    deleteRecurringEventById(id: string): boolean;

    deleteFutureRecurringEventsById(id: string, start: Date): boolean;
}

export class CalenthorApi implements ICalenthorApi {

    private calendarService = new CalendarService();

    public createEvent(event: EventItem) {
        return this.calendarService.createEvent(event);
    }

    public listEvents(range: DateRange) {
        return this.calendarService.listEvents(range);
    }

    public updateEvent(event: EventItem) {
        return this.calendarService.updateEvent(event);
    }

    public deleteEvent(id: string) {
        return this.calendarService.deleteEvent(id);
    }

    public deleteRecurringEventById(id: string) {
        return this.calendarService.deleteRecurringEventById(id);
    }

    public deleteFutureRecurringEventsById(id: string, start: Date) {
        return this.calendarService.deleteFutureRecurringEventsById(id, start);
    }
}
