import { CalendarEvent } from '../domain/models';

/**
 * A simple in-memory repository for calendar events. Is not intended for production use.
 * This repository can be replaced with a real database or other storage solution.
 */
interface IEventRepository {
    addEvent(event: CalendarEvent): void;

    listEvents(): CalendarEvent[];

    findEventById(id: string): CalendarEvent | undefined;

    updateEvent(updatedEvent: CalendarEvent): boolean;

    deleteEvent(id: string): boolean;
}

export class EventRepository implements IEventRepository {
    private events: CalendarEvent[] = [];

    /**
     * Adds a new event to the repository.
     * @param event The event to add.
     */
    public addEvent(event: CalendarEvent): void {
        this.events.push(event);
    }

    /**
     * Lists all events.
     * @returns An array of all calendar events.
     */
    public listEvents(): CalendarEvent[] {
        return this.events;
    }

    /**
     * Finds an event by its ID.
     * @param id The ID of the event to find.
     * @returns The found event or undefined if no event is found.
     */
    public findEventById(id: string): CalendarEvent | undefined {
        return this.events.find(event => event.id === id);
    }

    /**
     * Updates an existing event.
     * @param updatedEvent The event with updated information.
     * @returns True if the event was updated, false if the event was not found.
     */
    public updateEvent(updatedEvent: CalendarEvent): boolean {
        const index = this.events.findIndex(event => event.id === updatedEvent.id);
        this.events[index] = updatedEvent;
        return true;
    }

    /**
     * Deletes an event by its ID.
     * @param id The ID of the event to delete.
     * @returns True if the event was deleted, false if the event was not found.
     */
    public deleteEvent(id: string): boolean {
        const index = this.events.findIndex(event => event.id === id);
        this.events.splice(index, 1);
        return true;
    }
}
