import { DateTime } from 'luxon';

export const isElapsed = (date: DateTime, minutes: number): boolean => {
    return date.diffNow('minutes').minutes > minutes;
}