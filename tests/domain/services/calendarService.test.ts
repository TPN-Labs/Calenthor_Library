import { CalendarService } from '../../../src/domain/services';
import { Duration } from '../../../src/domain/models';
import { EventNotFoundError, EventOverlapsError } from '../../../src/errors';

describe('CalendarService', () => {
    let calendarService: CalendarService;

    beforeEach(() => {
        calendarService = new CalendarService();
    });

    it('it creates a new event successfully', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calendarService.createEvent({
            title: 'Test Event',
            start,
            duration,
        });
        expect(event.title)
            .toBe('Test Event');
        expect(event.start)
            .toBe(start);
        expect(event.duration)
            .toBe(duration);
    });

    it('it allows overlap for events with allowOverlap set to true', () => {
        const start = new Date();
        const duration = new Duration(60);
        calendarService.createEvent({
            title: 'Test Event 1',
            start,
            duration,
        });
        expect(() => {
            calendarService.createEvent({
                title: 'Test Event 2',
                start,
                duration,
                allowOverlap: true,
            });
        })
            .not.toThrow(EventOverlapsError);
    });

    it('it does not allow overlap for events with allowOverlap set to false', () => {
        const start = new Date();
        const duration = new Duration(60);
        calendarService.createEvent({
            title: 'Test Event 1',
            start,
            duration,
        });
        expect(() => {
            calendarService.createEvent({
                title: 'Test Event 2',
                start,
                duration,
                allowOverlap: false,
            });
        })
            .toThrow(EventOverlapsError);
    });

    it('it throws an error when creating an overlapping event', () => {
        const start = new Date();
        const duration = new Duration(60);
        calendarService.createEvent({
            title: 'Test Event 1',
            start,
            duration,
        });
        expect(() => {
            calendarService.createEvent({
                title: 'Test Event 2',
                start,
                duration,
            });
        })
            .toThrow(EventOverlapsError);
    });

    it('it lists events within a given date range (start)', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calendarService.createEvent({
            title: 'Test Event',
            start,
            duration,
        });

        const events = calendarService.listEvents({
            start: new Date(start.getTime() - duration.value * 2),
            end: new Date(),
        });
        expect(events)
            .toContain(event);
    });

    it('it lists events within a given date range (end)', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calendarService.createEvent({
            title: 'Test Event',
            start,
            duration,
        });

        const events = calendarService.listEvents({
            start,
            end: new Date(start.getTime() + duration.value * 2),
        });
        expect(events)
            .toContain(event);
    });

    it('it updates an existing event successfully', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calendarService.createEvent({
            title: 'Test Event',
            start,
            duration,
        });
        const updatedEvent = calendarService.updateEvent({
            id: event.id,
            title: 'Updated Event',
            start,
            duration,
        });
        expect(updatedEvent.title)
            .toBe('Updated Event');
    });

    it('it throws an error when updating a non-existing event', () => {
        expect(() => {
            calendarService.updateEvent({
                id: 'non-existing-id',
                title: 'Updated Event',
                start: new Date(),
                duration: new Duration(60),
            });
        })
            .toThrow(EventNotFoundError);
    });

    it('it throws an error when updating an event to overlap with another event', () => {
        const start = new Date();
        const duration = new Duration(60);
        calendarService.createEvent({
            title: 'Test Event 1',
            start,
            duration,
        });
        const event2 = calendarService.createEvent({
            title: 'Test Event 2',
            start: new Date(start.getTime() + duration.value),
            duration,
        });
        expect(() => {
            calendarService.updateEvent({
                id: event2.id,
                title: 'Updated Event',
                start,
                duration,
            });
        })
            .toThrow(EventOverlapsError);
    });

    it('it deletes an existing event successfully', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calendarService.createEvent({
            title: 'Test Event',
            start,
            duration,
        });
        const isDeleted = calendarService.deleteEvent(event.id);
        expect(isDeleted)
            .toBe(true);
    });

    it('it throws an error when deleting a non-existing event', () => {
        expect(() => {
            calendarService.deleteEvent('non-existing-id');
        })
            .toThrow(EventNotFoundError);
    });

    /*
    it('it generates occurrences correctly for a recurring event with an end date', () => {
        const start = new Date();
        const duration = new Duration(60);
        const recurrenceRule = new RecurrenceRule(RecurrenceFrequency.DAILY, 1, null, new Date(start.getTime() + duration.value * 3));
        const event = calendarService.createEvent('Test Event', start, duration, recurrenceRule);

        const occurrences = calendarService.listEvents({
            start,
            end: new Date(start.getTime() + duration.value * 5),
        });
        expect(occurrences).toHaveLength(4);
    });

    it('it stops generating occurrences after the end date of a recurring event', () => {
        const start = new Date();
        const duration = new Duration(60);
        const recurrenceRule = new RecurrenceRule(RecurrenceFrequency.DAILY, 1, new Date(start.getTime() + duration.value * 3));
        const event = calendarService.createEvent('Test Event', start, duration, recurrenceRule);

        const occurrences = calendarService.listEvents({
            start,
            end: new Date(start.getTime() + duration.value * 10),
        });
        expect(occurrences).toHaveLength(4);
    });

    it('it generates no occurrences for a recurring event with an end date in the past', () => {
        const start = new Date();
        const duration = new Duration(60);
        const recurrenceRule = new RecurrenceRule(RecurrenceFrequency.DAILY, 1, new Date(start.getTime() - duration.value));
        const event = calendarService.createEvent('Test Event', start, duration, recurrenceRule);

        const occurrences = calendarService.listEvents({
            start,
            end: new Date(start.getTime() + duration.value * 5),
        });
        expect(occurrences).toHaveLength(0);
    });

     */
});
