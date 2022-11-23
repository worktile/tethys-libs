import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThyAudioPlayerComponent } from './audio-player.component';
import { ThyMediaPlayerBaseComponent } from './media-base.component';
import { ThyVideoPlayerComponent } from './video-player.component';

@NgModule({
    declarations: [ThyMediaPlayerBaseComponent, ThyVideoPlayerComponent, ThyAudioPlayerComponent],
    imports: [CommonModule],
    exports: [ThyVideoPlayerComponent, ThyAudioPlayerComponent],
    providers: []
})
export class ThyProMediaModule {}
