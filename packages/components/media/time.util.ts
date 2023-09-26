import { isNumber } from '@tethys/cdk';

// Time helpers
export const getHours = (value: number) => Math.trunc((value / 60 / 60) % 60);
export const getMinutes = (value: number) => Math.trunc((value / 60) % 60);
export const getSeconds = (value: number) => Math.trunc(value % 60);

// Format time to UI friendly string
export function formatTime(time = 0, displayHours = false, inverted = false): string {
    if (!isNumber(time) || isNaN(time)) {
        return formatTime(undefined, displayHours, inverted);
    }

    // Format time component to add leading zero
    const format = (value: number) => `0${value}`.slice(-2);
    // Breakdown to hours, mins, secs
    let hours: string | number = getHours(time);
    const mins = getMinutes(time);
    const secs = getSeconds(time);

    // Do we need to display hours?
    if (displayHours || hours > 0) {
        hours = `${hours}:`;
    } else {
        hours = '';
    }

    return `${inverted && time > 0 ? '-' : ''}${hours}${format(mins)}:${format(secs)}`;
}
