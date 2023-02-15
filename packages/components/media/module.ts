import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyAudioPlayerComponent } from './audio-player.component';
import { ThyMediaPlayerBaseComponent } from './media-base.component';
import { ThyMediaProgressComponent } from './progress.component';
import { ThyTimeFormatPipe } from './time.pipe';
import { ThyVideoPlayerComponent } from './video-player.component';
@NgModule({
    declarations: [
        ThyMediaPlayerBaseComponent,
        ThyVideoPlayerComponent,
        ThyAudioPlayerComponent,
        ThyMediaProgressComponent,
        ThyTimeFormatPipe
    ],
    imports: [CommonModule, FormsModule, ThyIconModule, ThyDropdownModule, ThyActionModule],
    exports: [ThyVideoPlayerComponent, ThyAudioPlayerComponent, ThyTimeFormatPipe],
    providers: []
})
export class ThyProMediaModule {}
