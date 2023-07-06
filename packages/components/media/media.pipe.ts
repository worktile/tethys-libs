import { Pipe, PipeTransform } from '@angular/core';
import { formatTime } from './time.util';

@Pipe({ name: 'thyTimeFormat' })
export class ThyTimeFormatPipe implements PipeTransform {
    constructor() {}

    transform(time = 0, displayHours = false, inverted = false): string {
        return formatTime(time, displayHours, inverted);
    }
}

@Pipe({ name: 'thyVolumeFormat' })
export class ThyVolumeFormatPipe implements PipeTransform {
    constructor() {}

    transform(volume: number | undefined): number {
        return Number(((volume || 0) * 100).toFixed(0));
    }
}

@Pipe({ name: 'thyMediaStatePath' })
export class ThyMediaStatePathPipe implements PipeTransform {
    constructor() {}

    transform(isPlaying: boolean, isAudio: boolean): string {
        return isPlaying
            ? isAudio
                ? '/assets/images/media/paused.svg'
                : '/assets/images/media/paused-white.svg'
            : isAudio
            ? '/assets/images/media/play.svg'
            : '/assets/images/media/play-white.svg';
    }
}

@Pipe({ name: 'thyMediaMutedPath' })
export class ThyMediaMutedPathPipe implements PipeTransform {
    constructor() {}

    transform(isMuted: boolean): string {
        return isMuted ? '/assets/images/media/muted.svg' : '/assets/images/media/volume.svg';
    }
}
