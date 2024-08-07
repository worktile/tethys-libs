import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { useHostRenderer } from '@tethys/cdk/dom';
import { ThyActionModule } from 'ngx-tethys/action';
import { MixinBase, mixinUnsubscribe } from 'ngx-tethys/core';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThySliderType } from 'ngx-tethys/slider';
import { DEFAULT_PLAYBACK_RATES } from './media-base.component';
import { ThyTimeFormatPipe, ThyVolumeFormatPipe } from './media.pipe';
import { ThyMediaProgressComponent } from './progress.component';

@Component({
    selector: 'thy-video-controls',
    host: {
        class: 'thy-media-controls'
    },
    template: `
        <thy-media-progress
            class="controls-progress"
            [thyProgressValue]="progressValue"
            [thyBufferedValue]="bufferedValue"
            [thyProgressType]="progressType"
            (thyMoveStart)="onMouseStart()"
            (thyMoveEnd)="onMouseEnd()"
            (thyAfterChange)="afterProgressChange($event)"
        ></thy-media-progress>
        <div class="controls-main">
            <div class="d-flex align-items-center controls-left">
                <a
                    class="controls-play thy-action"
                    [class.disabled]="!mediaHtmlElement?.duration"
                    href="javascript:;"
                    (click)="playOrPause()"
                >
                    <thy-icon [class.paused-image]="!isPlaying" [thyIconName]="isPlaying ? 'pause' : 'play-fill'"></thy-icon>
                </a>

                <div class="controls-time">
                    {{ mediaHtmlElement?.currentTime | thyTimeFormat }} /
                    <span class="duration-time">{{ mediaHtmlElement?.duration | thyTimeFormat }}</span>
                </div>
            </div>
            <div class="d-flex controls-right">
                <a
                    class="mr-2 controls-muted"
                    thyAction
                    href="javascript:;"
                    (click)="muted()"
                    thyDropdownActive="active"
                    [thyDropdown]="volume"
                    thyPanelClass="volume-dropdown-panel"
                    [thyPlacement]="placement"
                    (thyActiveChange)="actionActiveChange($event)"
                >
                    <thy-icon [thyIconName]="mediaHtmlElement?.muted ? 'muted' : 'volume'"></thy-icon>
                </a>

                <a
                    thyAction
                    [thyDropdown]="playbackRate"
                    [thyPlacement]="'topRight'"
                    thyDropdownActive="active"
                    (thyActiveChange)="actionActiveChange($event)"
                    class="controls-playback-rate"
                    href="javascript:;"
                    >倍速</a
                >
            </div>
        </div>

        <thy-dropdown-menu #volume>
            <div class="volume-progress-container">
                <span class="mb-2">{{ mediaHtmlElement?.volume | thyVolumeFormat }}%</span>

                <thy-media-progress
                    class="volume-progress"
                    [thyDirection]="'vertical'"
                    [thyProgressType]="progressType"
                    [thyProgressValue]="mediaHtmlElement?.volume | thyVolumeFormat"
                    (thyAfterChange)="afterVolumeChange($event)"
                ></thy-media-progress>
            </div>
        </thy-dropdown-menu>

        <thy-dropdown-menu #playbackRate>
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
        FormsModule,
        ThyIconModule,
        ThyDropdownModule,
        ThyActionModule,
        ThyMediaProgressComponent,
        ThyTimeFormatPipe,
        ThyVolumeFormatPipe
    ]
})
export class ThyVideoControlsComponent extends mixinUnsubscribe(MixinBase) implements OnInit {
    /**
     * 进度主题类型 primary | success | info | warning | danger
     */
    @Input('thyProgressType') progressType!: ThySliderType;

    /**
     * 媒体组件
     */
    @Input('thyMedia') media!: ElementRef;

    public get isPlaying(): boolean {
        return !!this.mediaHtmlElement?.duration && !this.mediaHtmlElement?.paused;
    }

    public get mediaHtmlElement(): HTMLMediaElement {
        return this.media?.nativeElement;
    }

    /**
     * 进度值
     */
    public progressValue: number = 0;

    /**
     * 缓存值
     */
    bufferedValue: number = 0;

    tempVolume: number = 1;

    popoverOptions = { placement: 'top', width: '48px', insideClosable: false };

    private hostRenderer = useHostRenderer();

    playBackRates = DEFAULT_PLAYBACK_RATES;

    placement = 'topCenter' as any;

    constructor(private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.hostRenderer.addClass('thy-media-controls-paused');
    }

    actionActiveChange(active: boolean) {
        if (active) {
            this.hostRenderer.addClass('thy-media-controls-paused');
            this.hostRenderer.removeClass('thy-media-controls-playing');
        } else {
            if (!this.mediaHtmlElement?.paused) {
                this.hostRenderer.addClass('thy-media-controls-playing');
                this.hostRenderer.removeClass('thy-media-controls-paused');
            }
        }
    }

    onCanPlay() {
        this.mediaHtmlElement.ontimeupdate = this.onTimeUpdate;
        this.mediaHtmlElement.onwaiting = this.onWaiting;
        this.cdr.markForCheck();
    }

    /**
     * 播放时间更新
     * 非禁用或当前时间为总时长重新设置进度
     */
    onTimeUpdate = () => {
        const { currentTime, duration, paused } = this.mediaHtmlElement;
        if (currentTime === duration || !paused) {
            this.setProgressValue();
        }
    };

    onWaiting = () => {
        const { currentTime, duration, paused } = this.mediaHtmlElement;
        if (currentTime === duration || !paused) {
            this.setProgressValue();
        }
    };

    /**
     * 设置进度以及缓存
     * 根据最新播放时间和总时长计算进度
     * 根据最新缓存和总时长重新计算缓存
     */
    setProgressValue() {
        const { currentTime, duration, buffered } = this.mediaHtmlElement;
        let ratio = currentTime / duration;
        this.progressValue = Math.round(ratio * 100);
        if (ratio !== 0 && ratio !== 1) {
            const bufferedValue = (((buffered?.end && buffered.end(ratio)) || 0) / duration) * 100;
            this.bufferedValue = Math.round(bufferedValue);
        }
        if (this.progressValue === 100) {
            this.mediaHtmlElement.currentTime = 0;
            this.setProgressValue();
        }
        this.cdr.markForCheck();
    }

    onMouseStart() {
        this.onPause();
    }

    onMouseEnd() {
        this.onPlay();
    }

    playOrPause() {
        if (this.mediaHtmlElement?.duration) {
            if (this.mediaHtmlElement.paused) {
                this.onPlay();
                this.hostRenderer.addClass('thy-media-controls-playing');
                this.hostRenderer.removeClass('thy-media-controls-paused');
            } else {
                this.onPause();
                this.hostRenderer.addClass('thy-media-controls-paused');
                this.hostRenderer.removeClass('thy-media-controls-playing');
            }
        }
    }

    onPlay() {
        if (this.mediaHtmlElement?.duration) {
            this.mediaHtmlElement.play && this.mediaHtmlElement.play();
            this.hostRenderer.removeClass('thy-media-controls-paused');
            this.tempVolume = this.mediaHtmlElement.volume;
            this.cdr.markForCheck();
        }
    }

    /**
     * 暂停播放
     * chrome 50后触发video.play会返回promise对象 播放失败会inject
     */
    onPause() {
        const playPromise = this.mediaHtmlElement.play && this.mediaHtmlElement.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.mediaHtmlElement.pause();
                    this.cdr.markForCheck();
                })
                .catch(() => {});
        }
    }

    afterVolumeChange(value: number) {
        this.mediaHtmlElement.volume = value / 100;
        this.tempVolume = this.mediaHtmlElement.volume;
        this.mediaHtmlElement.muted = false;
        this.cdr.markForCheck();
    }

    muted() {
        this.mediaHtmlElement.volume = this.mediaHtmlElement.muted ? this.tempVolume : 0;
        this.mediaHtmlElement.muted = !this.mediaHtmlElement.muted;
        this.cdr.markForCheck();
    }

    /**
     * 进度条点击事件
     * 根据当前播放时间
     * 设置缓存值
     * buffered.end 取值为 0-1
     */
    afterProgressChange(value: number) {
        const { duration, buffered } = this.mediaHtmlElement;

        console.log(duration, buffered);
        const currentTime = (value / 100) * duration;
        // 防止 duration 值为NaN
        if (isFinite(currentTime)) {
            this.mediaHtmlElement.currentTime = currentTime;
            const ratio = this.mediaHtmlElement.currentTime / duration;
            if (ratio !== 0 && ratio !== 1) {
                this.bufferedValue = (((buffered?.end && buffered.end(ratio)) || 0) / duration) * 100;
            }
        }
        this.cdr.markForCheck();
    }

    playBackRateChange(rate: number) {
        this.mediaHtmlElement.playbackRate = rate;
        this.cdr.markForCheck();
    }

    ngOnDestroy(): void {}
}
