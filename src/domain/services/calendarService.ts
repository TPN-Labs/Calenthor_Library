import { CalendarEvent } from '../models';
import { DateRange, RecurrenceFrequency, EventItem } from '../../types';
import { EventRepository } from '../../repositories';
import { EventIsNotRecurringError, EventNotFoundError, EventOverlapsError, EventRecurrenceInvalidError } from '../../errors';
import { generateUUID } from '../../utils';
import { MILLISECONDS_IN_A_DAY, MILLISECONDS_IN_A_MONTH, MILLISECONDS_IN_A_WEEK } from '../../config';

interface ICalendarService {
    createEvent(event: EventItem): void;

    listEvents(range: DateRange): CalendarEvent[];

    updateEvent(event: EventItem): CalendarEvent;

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
                if (!event.allowOverlap) {
                    return (start < event.end && end > event.start);
                }
                return false;
            });
    }

    private generateOccurrences(event: CalendarEvent, start: Date, end: Date): CalendarEvent[] {
        const occurrences: CalendarEvent[] = [];
        let current = event.start;
        while (current <= end) {
            if (event.recurrenceRule!.endDate && current > event.recurrenceRule!.endDate) break;
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

    public createEvent(event: EventItem): CalendarEvent {
        const end = new Date(event.start.getTime() + event.duration.value);
        if (!event.allowOverlap && this.checkForOverlap(event.start, end)) {
            throw new EventOverlapsError();
        }

        const newEvent = new CalendarEvent(
            generateUUID(),
            event.title,
            event.start,
            event.duration,
            event.allowOverlap,
            event.recurrenceRule,
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

    public updateEvent(event: EventItem): CalendarEvent {
        const existingEvent = this.eventRepository.findEventById(event.id!);
        if (!existingEvent) {
            throw new EventNotFoundError(`Update failed. Event with ID ${event.id} not found.`);
        }

        const newEnd = new Date(event.start.getTime() + event.duration.value);
        if (this.checkForOverlap(event.start, newEnd, event.id)) {
            throw new EventOverlapsError();
        }

        existingEvent.title = event.title;
        existingEvent.start = event.start;
        existingEvent.duration = event.duration;
        existingEvent.recurrenceRule = event.recurrenceRule;

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
        existingEvent.recurrenceRule.endDate = start;
        return true;
    }
}
