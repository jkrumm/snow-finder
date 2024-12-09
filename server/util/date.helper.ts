import { DateTime } from 'luxon';

export function isElapsed(date: DateTime, minutes: number): boolean {
    return date.diffNow("minutes").minutes >= minutes;
}