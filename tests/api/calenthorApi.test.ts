import { CalenthorApi } from '../../src';
import { Duration } from '../../src/domain/models';
import { DateRange } from '../../src/types';

describe('CalenthorApi', () => {
    let calenthorApi: CalenthorApi;

    beforeEach(() => {
        calenthorApi = new CalenthorApi();
    });

    it('it creates a new event successfully', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calenthorApi.createEvent('Test Event', start, duration);
        expect(event.title)
            .toBe('Test Event');
        expect(event.start)
            .toBe(start);
        expect(event.duration)
            .toBe(duration);
    });

    it('it lists events within a given date range', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calenthorApi.createEvent('Test Event', start, duration);
        const range: DateRange = {
            start,
            end: new Date(start.getTime() + duration.value),
        };
        const events = calenthorApi.listEvents(range);
        expect(events)
            .toContain(event);
    });

    it('it updates an existing event successfully', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calenthorApi.createEvent('Test Event', start, duration);
        const updatedEvent = calenthorApi.updateEvent(event.id, 'Updated Event', start, duration);
        expect(updatedEvent.title)
            .toBe('Updated Event');
    });

    it('it deletes an existing event successfully', () => {
        const start = new Date();
        const duration = new Duration(60);
        const event = calenthorApi.createEvent('Test Event', start, duration);
        const isDeleted = calenthorApi.deleteEvent(event.id);
        expect(isDeleted)
            .toBe(true);
    });
});
