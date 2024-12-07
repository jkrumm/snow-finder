const Weekdays = {
    "Monday": "Montag",
    "Tuesday": "Dienstag",
    "Wednesday": "Mittwoch",
    "Thursday": "Donnerstag",
    "Friday": "Freitag",
    "Saturday": "Samstag",
    "Sunday": "Sonntag",
};

export function translateWeekday (weekday: string): string  {
    return Weekdays[weekday as keyof typeof Weekdays];
}