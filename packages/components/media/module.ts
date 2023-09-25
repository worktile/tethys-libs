import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyProIconModule } from '../icon/module';
import { ThyAudioControlsComponent } from './audio-controls.component';
import { ThyAudioPlayerComponent } from './audio-player.component';
import { ThyVideoControlsComponent } from './controls.component';
import { ThyMediaPlayerBaseComponent } from './media-base.component';
import { ThyTimeFormatPipe, ThyVolumeFormatPipe } from './media.pipe';
import { ThyMediaProgressComponent } from './progress.component';
import { ThyVideoPlayerComponent } from './video-player.component';
@NgModule({
    declarations: [
        ThyMediaPlayerBaseComponent,
        ThyVideoPlayerComponent,
        ThyAudioPlayerComponent,
        ThyMediaProgressComponent,
        ThyVideoControlsComponent,
        ThyAudioControlsComponent,
        ThyTimeFormatPipe,
        ThyVolumeFormatPipe
    ],
    imports: [CommonModule, FormsModule, ThyIconModule, ThyDropdownModule, ThyActionModule, ThyProIconModule],
    exports: [ThyVideoPlayerComponent, ThyAudioPlayerComponent],
    providers: []
})
export class ThyProMediaModule {}
