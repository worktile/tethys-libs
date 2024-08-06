import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyFlexibleTextModule } from 'ngx-tethys/flexible-text';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyProIconModule } from '../icon/module';
import { ThyVideoControlsComponent } from './controls.component';
import { ThyTimeFormatPipe, ThyVolumeFormatPipe } from './media.pipe';
import { ThyMediaProgressComponent } from './progress.component';

@Component({
    selector: 'thy-audio-controls',
    host: {
        class: 'thy-media-controls thy-media-controls-audio'
    },
    template: `
        <ng-container>
            <div class="controls-main">
                <a
                    class="controls-play thy-action"
                    [class.disabled]="!mediaHtmlElement?.duration"
                    href="javascript:;"
                    (click)="playOrPause()"
                >
                    <thy-pro-icon [class.paused-image]="!isPlaying" [thyIconName]="isPlaying ? 'paused' : 'play'"></thy-pro-icon>
                </a>
                <div class="controls-content">
                    <div class="file-description" *ngIf="fileName">
                        <thy-flexible-text class="file-name" [thyTooltipContent]="fileName"> {{ fileName }}</thy-flexible-text>
                        <span class="file-size" *ngIf="fileSize">{{ fileSize + 'MB' }}</span>
                    </div>

                    <thy-flexible-text [thyTooltipContent]="errorTips" class="error-tip" *ngIf="errorTips">
                        {{ errorTips }}
                    </thy-flexible-text>

                    <div class="d-flex align-items-center">
                        <div class="current-time mr-4">
                            {{ mediaHtmlElement?.currentTime | thyTimeFormat }}
                        </div>

                        <thy-media-progress
                            class="controls-progress"
                            [thyProgressValue]="progressValue"
                            [thyBufferedValue]="bufferedValue"
                            [thyProgressType]="progressType"
                            (thyMoveStart)="onMouseStart()"
                            (thyMoveEnd)="onMouseEnd()"
                            (thyAfterChange)="afterProgressChange($event)"
                        ></thy-media-progress>
                    </div>
                </div>
                <div class="controls-right">
                    <a thyAction thyDropdownActive="active" [thyDropdown]="menu" class="controls-playback-rate" href="javascript:;">倍速</a>

                    <div class="duration-time">
                        {{ mediaHtmlElement?.duration | thyTimeFormat }}
                    </div>
                </div>
            </div>
        </ng-container>

        <thy-dropdown-menu #menu>
            <a
                [class.active]="mediaHtmlElement?.playbackRate === item"
                *ngFor="let item of playBackRates"
                thyDropdownMenuItem
                href="javascript:;"
                (click)="playBackRateChange(item)"
            >
                <span>{{ item }}X</span>
            </a>
        </thy-dropdown-menu>
    `,
    standalone: true,
    imports: [
        NgIf,
        CommonModule,
        ThyIconModule,
        ThyProIconModule,
        ThyFlexibleTextModule,
        ThyDropdownModule,
        ThyActionModule,
        ThyMediaProgressComponent,
        ThyTimeFormatPipe,
        ThyVolumeFormatPipe
    ]
})
export class ThyAudioControlsComponent extends ThyVideoControlsComponent implements OnInit {
    @Input('thyFileName') fileName!: string;

    @Input('thyFileSize') fileSize!: number;

    @Input('thyErrorTips') errorTips!: string;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
    }
}
