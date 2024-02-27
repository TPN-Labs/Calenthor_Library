import { CalendarEvent, Duration, RecurrenceRule } from '../models';
import { DateRange, RecurrenceFrequency } from '../../types';
import { EventRepository } from '../../repositories';
import { EventIsNotRecurringError, EventNotFoundError, EventOverlapsError, EventRecurrenceInvalidError } from '../../errors';
import { generateUUID } from '../../utils';
import { MILLISECONDS_IN_A_DAY, MILLISECONDS_IN_A_MONTH, MILLISECONDS_IN_A_WEEK } from '../../config';

interface ICalendarService {
    createEvent(title: string, start: Date, duration: Duration): void;

    listEvents(range: DateRange): CalendarEvent[];

    updateEvent(id: string, title: string, start: Date, duration: Duration, recurrenceRule?: RecurrenceRule): CalendarEvent;

    deleteEvent(id: string): boolean;

    deleteRecurringEventById(id: string): boolean;

    deleteFutureRecurringEventsById(id: string, start: Date): boolean;
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

    private generateOccurrences(event: CalendarEvent, start: Date, end: Date): CalendarEvent[] {
        const occurrences: CalendarEvent[] = [];
        let current = event.start;
        while (current <= end) {
            if (current >= start) {
                occurrences.push(new CalendarEvent(
                    generateUUID(),
                    event.title,
                    current,
                    event.duration,
                ));
            }
            switch (event.recurrenceRule!.frequency) {
            case RecurrenceFrequency.DAILY:
                current = new Date(current.getTime() + event.recurrenceRule!.interval * MILLISECONDS_IN_A_DAY);
                break;
            case RecurrenceFrequency.WEEKLY:
                current = new Date(current.getTime() + event.recurrenceRule!.interval * MILLISECONDS_IN_A_WEEK);
                break;
            case RecurrenceFrequency.MONTHLY:
                current = new Date(current.getTime() + event.recurrenceRule!.interval * MILLISECONDS_IN_A_MONTH);
                break;
            default:
                throw new EventRecurrenceInvalidError(event.recurrenceRule!.frequency);
            }
        }
        return occurrences;
    }

    public createEvent(title: string, start: Date, duration: Duration) {
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

    public listEvents(range: DateRange): CalendarEvent[] {
        const allEvents = this.eventRepository.listEvents();
        const recurringEventsExpanded = allEvents.flatMap(event => {
            if (!event.recurrenceRule) return [event]; // Non-recurring events are returned as is
            return this.generateOccurrences(event, range.start, range.end);
        });

        return recurringEventsExpanded.filter(event =>
            (event.start >= range.start && event.start <= range.end) ||
            (event.end >= range.start && event.end <= range.end));
    }

    public updateEvent(id: string, title: string, start: Date, duration: Duration, recurrenceRule?: RecurrenceRule): CalendarEvent {
        const existingEvent = this.eventRepository.findEventById(id);
        if (!existingEvent) {
            throw new EventNotFoundError(`Update failed. Event with ID ${id} not found.`);
        }

        const newEnd = new Date(start.getTime() + duration.value);
        if (this.checkForOverlap(start, newEnd, id)) {
            throw new EventOverlapsError();
        }

        existingEvent.title = title;
        existingEvent.start = start;
        existingEvent.duration = duration;
        existingEvent.recurrenceRule = recurrenceRule;

        this.eventRepository.updateEvent(existingEvent);
        return existingEvent;
    }

    public deleteEvent(id: string): boolean {
        const existingEvent = this.eventRepository.findEventById(id);
        if (!existingEvent) {
            throw new EventNotFoundError(`Delete failed. Event with ID ${id} not found.`);
        }

        return this.eventRepository.deleteEvent(id);
    }

    public deleteRecurringEventById(id: string): boolean {
        const existingEvent = this.eventRepository.findEventById(id);
        if (!existingEvent) {
            throw new EventNotFoundError(`Delete failed. Event with ID ${id} not found.`);
        }
        if (!existingEvent.recurrenceRule) {
            throw new EventIsNotRecurringError(`Delete failed. Event with ID ${id} is not recurring.`);
        }

        return this.eventRepository.deleteEvent(id);
    }

    public deleteFutureRecurringEventsById(id: string, start: Date): boolean {
        const existingEvent = this.eventRepository.findEventById(id);
        if (!existingEvent) {
            throw new EventNotFoundError(`Delete failed. Event with ID ${id} not found.`);
        }
        if (!existingEvent.recurrenceRule) {
            throw new EventIsNotRecurringError(`Delete failed. Event with ID ${id} is not recurring.`);
        }

        const allEvents = this.eventRepository.listEvents();
        const futureEvents = allEvents.filter(event =>
            event.id !== id &&
            event.recurrenceRule &&
            event.recurrenceRule.frequency === existingEvent.recurrenceRule!.frequency &&
            event.recurrenceRule.interval === existingEvent.recurrenceRule!.interval &&
            event.start >= start);

        futureEvents.forEach(event => this.eventRepository.deleteEvent(event.id));
        return true;
    }
}
