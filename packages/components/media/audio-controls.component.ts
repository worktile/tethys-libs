import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyFlexibleTextModule } from 'ngx-tethys/flexible-text';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyVideoControlsComponent } from './controls.component';
import { ThyTimeFormatPipe } from './media.pipe';
import { ThyMediaProgressComponent } from './progress.component';
import { injectLocale } from '@tethys/pro/i18n';

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
                    <thy-icon [class.paused-image]="!isPlaying" [thyIconName]="isPlaying ? 'pause' : 'play-fill'"></thy-icon>
                </a>
                <div class="controls-content">
                    @if (!errorTips) {
                        <div class="file-description" [class.hidden]="!fileName">
                            <thy-flexible-text class="file-name" [thyTooltipContent]="fileName"> {{ fileName }}</thy-flexible-text>
                            @if (fileSize) {
                                <span class="file-size">{{ fileSize }}</span>
                            }
                        </div>
                    } @else {
                        <thy-flexible-text [thyTooltipContent]="errorTips" class="error-tip">
                            {{ errorTips }}
                        </thy-flexible-text>
                    }

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
                    <a
                        [class.hidden]="errorTips"
                        thyAction
                        thyDropdownActive="active"
                        [thyDropdown]="menu"
                        class="controls-playback-rate"
                        thyPanelClass="playback-rate-dropdown-panel"
                        href="javascript:;"
                        >{{ locale().speed }}</a
                    >

                    <div class="duration-time">
                        {{ mediaHtmlElement?.duration | thyTimeFormat }}
                    </div>
                </div>
            </div>
        </ng-container>

        <thy-dropdown-menu #menu>
            @for (item of playBackRates; track $index) {
                <a
                    [class.active]="mediaHtmlElement?.playbackRate === item"
                    thyDropdownMenuItem
                    href="javascript:;"
                    (click)="playBackRateChange(item)"
                >
                    <span>{{ item }}X</span>
                </a>
            }
        </thy-dropdown-menu>
    `,
    imports: [ThyIconModule, ThyFlexibleTextModule, ThyDropdownModule, ThyActionModule, ThyMediaProgressComponent, ThyTimeFormatPipe]
})
export class ThyAudioControlsComponent extends ThyVideoControlsComponent implements OnInit {
    locale = injectLocale();

    @Input('thyFileName') fileName!: string;

    @Input('thyFileSize') fileSize!: number;

    @Input('thyErrorTips') errorTips!: string;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
    }
}
