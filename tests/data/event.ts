import { CalendarEvent } from '../../src/domain/models';
import { generateUUID } from '../../src/utils';
import { MILLISECONDS_IN_A_SECOND, SECONDS_IN_A_MINUTE } from '../../src/config';

const generateString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const newEvent = new CalendarEvent(
    generateUUID(),
    generateString(10),
    new Date(),
    { value: MILLISECONDS_IN_A_SECOND * SECONDS_IN_A_MINUTE * 30 }, // 30 minutes
);
