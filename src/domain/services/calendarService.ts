import { CalendarEvent, Duration } from '../models';
import { DateRange } from '../../types';
import { EventRepository } from '../../repositories';
import { EventNotFoundError, EventOverlapsError } from '../../errors';
import { generateUUID } from '../../utils';

interface ICalendarService {
    createEvent(title: string, start: Date, duration: Duration): void;

    listEvents(range: DateRange): CalendarEvent[];

    updateEvent(id: string, title: string, start: Date, duration: Duration): CalendarEvent;

    deleteEvent(id: string): boolean;
}

export class CalendarService implements ICalendarService {
    private eventRepository = new EventRepository();

    private checkForOverlap(start: Date, end: Date, excludeEventId?: string): boolean {
        return this.eventRepository.listEvents()
            .some(event => {
                if (excludeEventId && event.id === excludeEventId) return false;
                return (start < event.end && end > event.start);
            });
    }

    createEvent(title: string, start: Date, duration: Duration) {
        const end = new Date(start.getTime() + duration.value);
        if (this.checkForOverlap(start, end)) {
            throw new EventOverlapsError();
        }

        const newEvent = new CalendarEvent(
            generateUUID(),
            title,
            start,
            duration,
        );
        this.eventRepository.addEvent(newEvent);
        return newEvent;
    }

    listEvents(range: DateRange): CalendarEvent[] {
        return this.eventRepository
            .listEvents()
            .filter(event =>
                (event.start >= range.start && event.start <= range.end) ||
                (event.end >= range.start && event.end <= range.end));
    }

    updateEvent(id: string, title: string, start: Date, duration: Duration): CalendarEvent {
        const existingEvent = this.eventRepository.findEventById(id);
        if (!existingEvent) {
            throw new EventNotFoundError(`Event with ID ${id} not found.`);
        }

        const newEnd = new Date(start.getTime() + duration.value);
        if (this.checkForOverlap(start, newEnd, id)) {
            throw new EventOverlapsError();
        }

        existingEvent.title = title;
        existingEvent.start = start;
        existingEvent.duration = duration;

        this.eventRepository.updateEvent(existingEvent);
        return existingEvent;
    }

    deleteEvent(id: string): boolean {
        const existingEvent = this.eventRepository.findEventById(id);
        if (!existingEvent) {
            throw new EventNotFoundError(`Event with ID ${id} not found.`);
        }

        return this.eventRepository.deleteEvent(id);
    }
}
