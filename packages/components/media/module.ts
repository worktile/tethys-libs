import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThyAudioPlayerComponent } from './audio-player/audio-player.component';
import { ThyVideoPlayerComponent } from './video-player/video-player.component';

@NgModule({
    declarations: [ThyVideoPlayerComponent, ThyAudioPlayerComponent],
    imports: [CommonModule],
    exports: [ThyVideoPlayerComponent, ThyAudioPlayerComponent],
    providers: []
})
export class ThyProMediaModule {}
