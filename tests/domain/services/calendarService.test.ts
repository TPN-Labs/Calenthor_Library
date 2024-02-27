import { CalenthorApi } from '../../../src';

describe('CalendarService', () => {
    let calendar: CalenthorApi;

    beforeEach(() => {
        calendar = new CalenthorApi();
    });

    it('fake test 2', () => {
        expect(2).toBe(2);
    });
});
