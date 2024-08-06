import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyAudioControlsComponent } from './audio-controls.component';
import { ThyAudioPlayerComponent } from './audio-player.component';
import { ThyVideoControlsComponent } from './controls.component';
import { ThyTimeFormatPipe, ThyVolumeFormatPipe } from './media.pipe';
import { ThyMediaProgressComponent } from './progress.component';
import { ThyVideoPlayerComponent } from './video-player.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ThyIconModule,
        ThyDropdownModule,
        ThyActionModule,
        ThyVideoPlayerComponent,
        ThyAudioPlayerComponent,
        ThyMediaProgressComponent,
        ThyVideoControlsComponent,
        ThyAudioControlsComponent,
        ThyTimeFormatPipe,
        ThyVolumeFormatPipe
    ],
    exports: [ThyVideoPlayerComponent, ThyAudioPlayerComponent],
    providers: []
})
export class ThyProMediaModule {}
