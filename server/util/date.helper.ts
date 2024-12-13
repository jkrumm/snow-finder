import { DateTime } from 'luxon';

export function isElapsed(date: DateTime, minutes: number): boolean {
    const nowMillis = DateTime.now().toMillis();
    const dateMillis = date.toMillis();
    const diff = nowMillis - dateMillis;
    const diffMinutes = diff / 1000 / 60;
    return diffMinutes > minutes;
}