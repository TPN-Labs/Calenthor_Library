import { CalendarService } from '../domain/services';
import { CalendarEvent } from '../domain/models';
import { DateRange, EventItem } from '../types';

/**
 * ICalenthorApi interface represents the contract for the Calenthor API.
 * It defines the methods that the Calenthor API should implement.
 *
 * @interface
 */
interface ICalenthorApi {
    /**
     * Creates a new event.
     *
     * @param {EventItem} event - The event to create.
     * @returns {void}
     */
    createEvent(event: EventItem): void;

    /**
     * Lists all events within a specified date range.
     *
     * @param {DateRange} range - The date range to list events for.
     * @returns {CalendarEvent[]} - The list of events within the specified date range.
     */
    listEvents(range: DateRange): CalendarEvent[];

    /**
     * Updates an existing event.
     *
     * @param {EventItem} event - The event to update.
     * @throws {EventNotFoundError} - If the event with the specified ID is not found.
     * @returns {CalendarEvent} - The updated event.
     */
    updateEvent(event: EventItem): CalendarEvent;

    /**
     * Deletes an event by its ID.
     *
     * @param {string} id - The ID of the event to delete.
     * @throws {EventNotFoundError} - If the event with the specified ID is not found.
     * @returns {boolean} - True if the event was successfully deleted, false otherwise.
     */
    deleteEvent(id: string): boolean;

    /**
     * Deletes a recurring event by its ID.
     *
     * @param {string} id - The ID of the recurring event to delete.
     * @throws {EventNotFoundError} - If the recurring event with the specified ID is not found.
     * @throws {EventIsNotRecurringError} - If the event with the specified ID is not recurring.
     * @returns {boolean} - True if the recurring event was successfully deleted, false otherwise.
     */
    deleteRecurringEventById(id: string): boolean;

    /**
     * Deletes all future instances of a recurring event by its ID from a specified start date.
     *
     * @param {string} id - The ID of the recurring event to delete future instances of.
     * @param {Date} start - The start date from which to delete future instances.
     * @throws {EventNotFoundError} - If the recurring event with the specified ID is not found.
     * @throws {EventIsNotRecurringError} - If the event with the specified ID is not recurring.
     * @returns {boolean} - True if the future instances of the recurring event were successfully deleted, false otherwise.
     */
    deleteFutureRecurringEventsById(id: string, start: Date): boolean;
}

export class CalenthorApi implements ICalenthorApi {

    private calendarService = new CalendarService();

    public createEvent(event: EventItem) {
        return this.calendarService.createEvent(event);
    }

    public listEvents(range: DateRange) {
        return this.calendarService.listEvents(range);
    }

    public updateEvent(event: EventItem) {
        return this.calendarService.updateEvent(event);
    }

    public deleteEvent(id: string) {
        return this.calendarService.deleteEvent(id);
    }

    public deleteRecurringEventById(id: string) {
        return this.calendarService.deleteRecurringEventById(id);
    }

    public deleteFutureRecurringEventsById(id: string, start: Date) {
        return this.calendarService.deleteFutureRecurringEventsById(id, start);
    }
}
