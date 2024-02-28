import { CalendarService } from '../../../src/domain/services';
import { Duration } from '../../../src/domain/models';
import { EventIsNotRecurringError, EventNotFoundError, EventOverlapsError } from '../../../src/errors';
import { RecurrenceFrequency } from '../../../src/types';
import { MILLISECONDS_IN_A_DAY, MILLISECONDS_IN_A_MONTH, MILLISECONDS_IN_A_WEEK } from '../../../src/config';
import { EventRangeInvalidError } from '../../../src/errors/EventRangeInvalidError';

describe('CalendarService', () => {
    let calendarService: CalendarService;

    beforeEach(() => {
        calendarService = new CalendarService();
    });

    describe('createEvent', () => {
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
                .not
                .toThrow(EventOverlapsError);
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

        it('it throws an error when creating another event that overlaps', () => {
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

        it('it throws an error when creating an overlapping event with another non-overlapping events', () => {
            const start1 = new Date();
            const duration = new Duration(60);
            calendarService.createEvent({
                title: 'Test Event 1',
                start: start1,
                duration,
            });

            expect(() => {
                const start2 = new Date(start1.getTime() + duration.value / 2);
                calendarService.createEvent({
                    title: 'Test Event 2',
                    start: start2,
                    duration,
                });
            })
                .toThrow(EventOverlapsError);
        });

        it('it creates a recurring event successfully', () => {
            const start = new Date();
            const duration = new Duration(60);
            const numberOfOccurrences = 3;
            calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
                recurrenceRule: {
                    frequency: RecurrenceFrequency.DAILY,
                    interval: 1,
                    count: numberOfOccurrences,
                    endDate: null,
                },
            });
            const occurrences = calendarService.listEvents({
                start,
                end: new Date(start.getTime() + MILLISECONDS_IN_A_DAY * 4),
            });
            expect(occurrences)
                .toHaveLength(numberOfOccurrences);
        });
    });

    describe('listEvents', () => {
        it('it throws an error when the start date is greater than the end date', () => {
            expect(() => {
                calendarService.listEvents({
                    start: new Date('2000-01-01'),
                    end: new Date('1990-01-01'),
                });
            }).toThrow(EventRangeInvalidError);
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

        it('it does not list a deleted event', () => {
            const start = new Date();
            const duration = new Duration(60);
            const event = calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
            });
            calendarService.deleteEvent(event.id);
            const events = calendarService.listEvents({
                start: new Date(start.getTime() - duration.value),
                end: new Date(start.getTime() + duration.value),
            });
            expect(events)
                .not
                .toContain(event);
        });

        it('it does not list occurrences of a deleted recurring event', () => {
            const start = new Date();
            const duration = new Duration(60);
            const event = calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
                recurrenceRule: {
                    frequency: RecurrenceFrequency.DAILY,
                    interval: 1,
                    count: null,
                    endDate: null,
                },
            });
            calendarService.deleteRecurringEventById(event.id);
            const events = calendarService.listEvents({
                start,
                end: new Date(start.getTime() + MILLISECONDS_IN_A_DAY * 4),
            });
            expect(events)
                .not
                .toContain(event);
        });

        it('it generates no occurrences for a recurring event with an end date in the past', () => {
            const start = new Date();
            const duration = new Duration(60);
            calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
                recurrenceRule: {
                    frequency: RecurrenceFrequency.DAILY,
                    interval: 1,
                    count: null,
                    endDate: new Date(start.getTime() - duration.value),
                },
            });

            const occurrences = calendarService.listEvents({
                start,
                end: new Date(start.getTime() + duration.value * 5),
            });
            expect(occurrences)
                .toHaveLength(0);
        });
    });

    describe('listRecurringEvents', () => {
        it('it generates occurrences for a daily recurring event', () => {
            const start = new Date();
            const duration = new Duration(60);
            calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
                recurrenceRule: {
                    frequency: RecurrenceFrequency.DAILY,
                    interval: 1,
                    count: null,
                    endDate: null,
                },
            });
            const occurrences = calendarService.listEvents({
                start,
                end: new Date(start.getTime() + MILLISECONDS_IN_A_DAY * 4),
            });
            expect(occurrences)
                .toHaveLength(5);
        });

        it('it generates occurrences for a weekly recurring event', () => {
            const start = new Date();
            const duration = new Duration(60);
            calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
                recurrenceRule: {
                    frequency: RecurrenceFrequency.WEEKLY,
                    interval: 1,
                    count: null,
                    endDate: null,
                },
            });
            const occurrences = calendarService.listEvents({
                start,
                end: new Date(start.getTime() + MILLISECONDS_IN_A_WEEK * 4),
            });
            expect(occurrences)
                .toHaveLength(5);
        });

        it('it generates occurrences for a monthly recurring event', () => {
            const start = new Date();
            const duration = new Duration(60);
            calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
                recurrenceRule: {
                    frequency: RecurrenceFrequency.MONTHLY,
                    interval: 1,
                    count: null,
                    endDate: null,
                },
            });
            const occurrences = calendarService.listEvents({
                start,
                end: new Date(start.getTime() + MILLISECONDS_IN_A_MONTH * 4),
            });
            expect(occurrences)
                .toHaveLength(5);
        });
    });

    describe('updateEvent', () => {
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
    });

    describe('deleteEvent', () => {
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
    });

    describe('deleteRecurringEventById', () => {
        it('it deletes a recurring event by id successfully', () => {
            const start = new Date();
            const duration = new Duration(60);
            const event = calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
                recurrenceRule: {
                    frequency: RecurrenceFrequency.DAILY,
                    interval: 1,
                    count: null,
                    endDate: null,
                },
            });
            const isDeleted = calendarService.deleteRecurringEventById(event.id);
            expect(isDeleted)
                .toBe(true);
        });

        it('it throws an error when deleting a non-existing recurring event', () => {
            expect(() => {
                calendarService.deleteRecurringEventById('non-existing-id');
            })
                .toThrow(EventNotFoundError);
        });

        it('it throws an error when deleting a non-recurring event', () => {
            const start = new Date();
            const duration = new Duration(60);
            const event = calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
            });
            expect(() => {
                calendarService.deleteRecurringEventById(event.id);
            })
                .toThrow(EventIsNotRecurringError);
        });
    });

    describe('deleteFutureRecurringEventsById', () => {
        it('it deletes future recurring events by id successfully', () => {
            const start = new Date();
            const duration = new Duration(60);
            const event = calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
                recurrenceRule: {
                    frequency: RecurrenceFrequency.DAILY,
                    interval: 1,
                    count: null,
                    endDate: null,
                },
            });
            const isDeleted = calendarService.deleteFutureRecurringEventsById(event.id, new Date(start.getTime() + MILLISECONDS_IN_A_DAY * 3));
            expect(isDeleted)
                .toBe(true);
        });

        it('it throws an error when deleting future recurring events of a non-existing recurring event', () => {
            expect(() => {
                calendarService.deleteFutureRecurringEventsById('non-existing-id', new Date());
            })
                .toThrow(EventNotFoundError);
        });

        it('it throws an error when deleting future recurring events of a non-recurring event', () => {
            const start = new Date();
            const duration = new Duration(60);
            const event = calendarService.createEvent({
                title: 'Test Event',
                start,
                duration,
            });
            expect(() => {
                calendarService.deleteFutureRecurringEventsById(event.id, new Date());
            })
                .toThrow(EventIsNotRecurringError);
        });
    });
});
