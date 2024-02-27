import { CalendarEvent } from '../domain/models';
import { EventNotFoundError } from '../errors';

export class EventRepository {
    private events: CalendarEvent[] = [];

    /**
     * Adds a new event to the repository.
     * @param event The event to add.
     */
    addEvent(event: CalendarEvent): void {
        this.events.push(event);
    }

    /**
     * Lists all events.
     * @returns An array of all calendar events.
     */
    listEvents(): CalendarEvent[] {
        return this.events;
    }

    /**
     * Finds an event by its ID.
     * @param id The ID of the event to find.
     * @returns The found event or undefined if no event is found.
     */
    findEventById(id: string): CalendarEvent | undefined {
        return this.events.find(event => event.id === id);
    }

    /**
     * Updates an existing event.
     * @param updatedEvent The event with updated information.
     * @returns True if the event was updated, false if the event was not found.
     */
    updateEvent(updatedEvent: CalendarEvent): boolean {
        const index = this.events.findIndex(event => event.id === updatedEvent.id);
        if (index === -1) {
            throw new EventNotFoundError(`Update failed. Event with ID ${updatedEvent.id} not found`);
        }
        this.events[index] = updatedEvent;
        return true;
    }

    /**
     * Deletes an event by its ID.
     * @param id The ID of the event to delete.
     * @returns True if the event was deleted, false if the event was not found.
     */
    deleteEvent(id: string): boolean {
        const index = this.events.findIndex(event => event.id === id);
        if (index === -1) {
            throw new EventNotFoundError(`Delete failed. Event with ID ${id} not found`);
        }
        this.events.splice(index, 1);
        return true;
    }
}
