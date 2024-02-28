import { generateUUID } from '../../src/utils';
import { MILLISECONDS_IN_A_MINUTE } from '../../src/config';
import { EventItem } from '../../src/types';

const generateString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const newEventItem: EventItem = {
    id: generateUUID(),
    title: generateString(10),
    start: new Date(),
    duration: { value: MILLISECONDS_IN_A_MINUTE * 30 }, // 30 minutes
};
