import { EventRepository } from '../../src/repositories';
import { CalendarEvent } from '../../src/domain/models';
import { EventNotFoundError } from '../../src/errors';
import { generateUUID } from '../../src/utils';
import { newEvent } from '../data';

describe('EventRepository', () => {
    let repository: EventRepository;
    let event: CalendarEvent;

    beforeEach(() => {
        repository = new EventRepository();
        event = newEvent;
    });

    it('adds an event successfully', () => {
        repository.addEvent(event);
        expect(repository.listEvents()).toContain(event);
    });

    it('lists all events', () => {
        repository.addEvent(event);
        const events = repository.listEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBe(event);
    });

    it('finds an event by its ID', () => {
        repository.addEvent(event);
        const foundEvent = repository.findEventById(event.id);
        expect(foundEvent).toBe(event);
    });

    it('returns undefined when finding an event by an unknown ID', () => {
        const foundEvent = repository.findEventById('unknown');
        expect(foundEvent).toBeUndefined();
    });

    it('updates an existing event', () => {
        repository.addEvent(event);
        event.title = 'new-title';
        const updateResult = repository.updateEvent(event);
        expect(updateResult).toBe(true);
        expect(repository.findEventById(event.id)?.title).toBe('new-title');
    });

    it('throws an error when updating a non-existing event', () => {
        expect(() => repository.updateEvent(event)).toThrow(EventNotFoundError);
    });

    it('deletes an event by its ID', () => {
        repository.addEvent(event);
        const deleteResult = repository.deleteEvent(event.id);
        expect(deleteResult).toBe(true);
        expect(repository.findEventById(event.id)).toBeUndefined();
    });

    it('throws an error when deleting a non-existing event', () => {
        expect(() => repository.deleteEvent(generateUUID())).toThrow(EventNotFoundError);
    });
});
