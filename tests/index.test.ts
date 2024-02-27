import { CalenthorApi } from '../src';

describe('Calendar API', () => {
    let calendar: CalenthorApi;

    beforeEach(() => {
        calendar = new CalenthorApi();
    });

    it('fake test', () => {
        expect(1).toBe(1);
    });
});
