import { CalenthorApi } from '../../src';
import { Duration } from '../../src/domain/models';
import { DateRange } from '../../src/types';
import { MILLISECONDS_IN_A_DAY } from '../../src/config';
import { newEventItem, newRecurrenceRule } from '../data';

describe('CalenthorApi', () => {
    let calenthorApi: CalenthorApi;

    beforeEach(() => {
        calenthorApi = new CalenthorApi();
    });

    it('it creates a new event successfully', () => {
        const event = calenthorApi.createEvent(newEventItem);
        expect(event.title)
            .toBe(newEventItem.title);
        expect(event.start)
            .toBe(newEventItem.start);
        expect(event.duration)
            .toBe(newEventItem.duration);
    });

    it('it lists events within a given date range', () => {
        const start = new Date();
        const duration = new Duration(MILLISECONDS_IN_A_DAY);
        const event = calenthorApi.createEvent(newEventItem);
        const range: DateRange = {
            start,
            end: new Date(start.getTime() + duration.value),
        };
        const events = calenthorApi.listEvents(range);
        expect(events)
            .toContain(event);
    });

    it('it updates an existing event successfully', () => {
        const event = calenthorApi.createEvent(newEventItem);
        const updatedEvent = calenthorApi.updateEvent({
            id: event.id,
            title: 'updated-title',
            start: new Date('2090-01-01'),
            duration: new Duration(2 * MILLISECONDS_IN_A_DAY),
        });
        expect(updatedEvent.title)
            .toBe('updated-title');
        expect(updatedEvent.start)
            .toEqual(new Date('2090-01-01'));
        expect(updatedEvent.duration)
            .toEqual(new Duration(2 * MILLISECONDS_IN_A_DAY));
    });

    it('it deletes an existing event successfully', () => {
        const event = calenthorApi.createEvent(newEventItem);
        const isDeleted = calenthorApi.deleteEvent(event.id);
        expect(isDeleted)
            .toBe(true);
    });

    it('it deletes a recurring event by id successfully', () => {
        const event = calenthorApi.createEvent({ ...newEventItem, recurrenceRule: newRecurrenceRule });
        const isDeleted = calenthorApi.deleteRecurringEventById(event.id);
        expect(isDeleted)
            .toBe(true);
    });

    it('it deletes future recurring events by id successfully', () => {
        const event = calenthorApi.createEvent({ ...newEventItem, recurrenceRule: newRecurrenceRule });
        const isDeleted = calenthorApi.deleteFutureRecurringEventsById(event.id, new Date('2090-01-01'));
        expect(isDeleted)
            .toBe(true);
    });
});
