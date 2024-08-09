import { Pipe, PipeTransform } from '@angular/core';
import { formatTime } from './time.util';

@Pipe({ name: 'thyTimeFormat', standalone: true })
export class ThyTimeFormatPipe implements PipeTransform {
    constructor() {}

    transform(time = 0, displayHours = false, inverted = false): string {
        return formatTime(time, displayHours, inverted);
    }
}

@Pipe({ name: 'thyVolumeFormat', standalone: true })
export class ThyVolumeFormatPipe implements PipeTransform {
    constructor() {}

    transform(volume: number | undefined): number {
        return Number(((volume || 0) * 100).toFixed(0));
    }
}
