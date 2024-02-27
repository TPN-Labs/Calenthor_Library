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
        const event = calendarService.createEvent('Test Event', start, duration);
        expect(event.title)
            .toBe('Test Event');
        expect(event.start)
            .toBe(start);
        expect(event.duration)
            .toBe(duration);
    });

    it('it throws an error when creating an overlapping event', () => {
        const start = new Date();
        const duration = new Duration(60);
        calendarService.createEvent('Test Event 1', start, duration);
        expect(() => {
            calendarService.createEvent('Test Event 2', start, duration);
        })
            .toThrow(EventOverlapsError);
    });

    it('it lists events within a given date range (start)', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calendarService.createEvent('Test Event', start, duration);

        const events = calendarService.listEvents({
            start: new Date(start.getTime() - duration.value * 2),
            end: new Date(),
        });
        expect(events).toContain(event);
    });

    it('it lists events within a given date range (end)', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calendarService.createEvent('Test Event', start, duration);

        const events = calendarService.listEvents({
            start,
            end: new Date(start.getTime() + duration.value * 2),
        });
        expect(events).toContain(event);
    });

    it('it updates an existing event successfully', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calendarService.createEvent('Test Event', start, duration);
        const updatedEvent = calendarService.updateEvent(event.id, 'Updated Event', start, duration);
        expect(updatedEvent.title)
            .toBe('Updated Event');
    });

    it('it throws an error when updating a non-existing event', () => {
        expect(() => {
            calendarService.updateEvent('non-existing-id', 'Updated Event', new Date(), new Duration(60));
        })
            .toThrow(EventNotFoundError);
    });

    it('it throws an error when updating an event to overlap with another event', () => {
        const start = new Date();
        const duration = new Duration(60);
        calendarService.createEvent('Test Event 1', start, duration);
        const event2 = calendarService.createEvent('Test Event 2', new Date(start.getTime() + duration.value), duration);
        expect(() => {
            calendarService.updateEvent(event2.id, 'Updated Event', start, duration);
        })
            .toThrow(EventOverlapsError);
    });

    it('it deletes an existing event successfully', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calendarService.createEvent('Test Event', start, duration);
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
});
