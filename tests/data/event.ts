import { CalendarEvent } from '../../src/domain/models';
import { generateUUID } from '../../src/utils';
import { MILISECONDS_IN_A_SECOND, SECONDS_IN_A_MINUTE } from '../../src/config';

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
    { value: MILISECONDS_IN_A_SECOND * SECONDS_IN_A_MINUTE * 30 }, // 30 minutes
);
