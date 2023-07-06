import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyAudioPlayerComponent } from './audio-player.component';
import { ThyMediaControlsComponent } from './controls.component';
import { ThyMediaPlayerBaseComponent } from './media-base.component';
import { ThyMediaMutedPathPipe, ThyMediaStatePathPipe, ThyTimeFormatPipe, ThyVolumeFormatPipe } from './media.pipe';
import { ThyMediaProgressComponent } from './progress.component';
import { ThyVideoPlayerComponent } from './video-player.component';
@NgModule({
    declarations: [
        ThyMediaPlayerBaseComponent,
        ThyVideoPlayerComponent,
        ThyAudioPlayerComponent,
        ThyMediaProgressComponent,
        ThyMediaControlsComponent,
        ThyTimeFormatPipe,
        ThyVolumeFormatPipe,
        ThyMediaStatePathPipe,
        ThyMediaMutedPathPipe
    ],
    imports: [CommonModule, FormsModule, ThyIconModule, ThyDropdownModule, ThyActionModule],
    exports: [
        ThyVideoPlayerComponent,
        ThyAudioPlayerComponent,
        ThyMediaPlayerBaseComponent,
        ThyTimeFormatPipe,
        ThyVolumeFormatPipe,
        ThyMediaStatePathPipe,
        ThyMediaMutedPathPipe
    ],
    providers: []
})
export class ThyProMediaModule {}
