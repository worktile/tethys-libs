import { Pipe, PipeTransform } from '@angular/core';
import { formatTime } from './time.util';

@Pipe({ name: 'thyTimeFormat' })
export class ThyTimeFormatPipe implements PipeTransform {
    constructor() {}

    transform(time = 0, displayHours = false, inverted = false): string {
        return formatTime(time, displayHours, inverted);
    }
}
