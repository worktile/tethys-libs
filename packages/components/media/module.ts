import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThyAudioPlayerComponent } from './audio-player.component';
import { ThyMediaPlayerBaseComponent } from './media-base.component';
import { ThyVideoPlayerComponent } from './video-player.component';

@NgModule({
    imports: [CommonModule, ThyMediaPlayerBaseComponent, ThyVideoPlayerComponent, ThyAudioPlayerComponent],
    exports: [ThyVideoPlayerComponent, ThyAudioPlayerComponent],
    providers: []
})
export class ThyProMediaModule {}
