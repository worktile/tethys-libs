import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { useHostRenderer } from '@tethys/cdk/dom';
import { DEFAULT_PLAYBACK_RATES, ThyMediaPlayerBaseComponent } from './media-base.component';

@Component({
    selector: 'thy-video-player',
    template: `
        <video
            #video
            class="media-content"
            [src]="fileSrc"
            [muted]="true"
            [autoplay]="thyAutoPlay"
            [controls]="true"
            (loadedmetadata)="onLoadedmetadata($event)"
            (error)="onError($event)"
            (canplay)="onCanPlay()"
            *ngIf="showMedia"
        ></video>
        <div class="error-tip" *ngIf="showErrorTip">
            {{ errorTipText }}
        </div>
        <div class="media-controls-container">
            <thy-media-progress
                [thyProgressValue]="progressValue"
                [thyBufferedValue]="bufferedValue"
                [thyProgressColor]="thyProgressColor"
                [thyProgressType]="thyProgressType"
                (thyMoveStart)="onMouseStart()"
                (thyMoveEnd)="onMouseEnd()"
                (thyAfterChange)="afterProgressChange($event)"
            ></thy-media-progress>
            <div class="controls">
                <div class="d-flex">
                    <a href="javascript:;" class="play mr-2" (click)="playOrPause()">
                        <thy-icon [thyIconName]="videoElement?.paused ? 'play-circle' : 'pause-circle'"></thy-icon>
                    </a>
                    <div class="time">{{ videoElement?.currentTime | thyTimeFormat }} / {{ videoElement?.duration | thyTimeFormat }}</div>
                </div>
                <div class="d-flex">
                    <div class="volume-bar-wrap">
                        <thy-icon
                            class="mr-2"
                            (click)="muted()"
                            [thyIconName]="videoElement?.muted ? 'app-bulletin' : 'app-bulletin'"
                        ></thy-icon>
                        <thy-media-progress
                            class="volume-bar mr-2"
                            [thyProgressValue]="videoElement?.volume | thyVolumeFormat"
                            [thyProgressType]="thyProgressType"
                            (thyAfterChange)="afterVolumeChange($event)"
                        ></thy-media-progress>
                    </div>

                    <a thyAction [thyDropdown]="menu" class="volume" href="javascript:;">倍速</a>

                    <thy-dropdown-menu #menu>
                        <a
                            [class.active]="videoElement?.playbackRate === item"
                            *ngFor="let item of playBackRates"
                            thyDropdownMenuItem
                            href="javascript:;"
                            (click)="playBackRateChange(item)"
                        >
                            <span>{{ item }}X</span>
                        </a>
                    </thy-dropdown-menu>
                </div>
            </div>
        </div>
    `
})
export class ThyVideoPlayerComponent extends ThyMediaPlayerBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding('class') class = 'thy-video-player thy-media-player';

    @ViewChild('video') video: ElementRef | undefined;

    /**
     * 媒体资源的url
     */
    @Input() set thySrc(src: string | SafeUrl) {
        this.fileSrc = src;
    }

    /**
     * 当下载到足够播放的媒体文件，是否可以自动播放
     */
    @Input() thyAutoPlay: boolean = false;

    public errorTips = {
        formatError: '该视频暂不支持预览，请升级浏览器版本或下载查看',
        networkError: '当前网络异常，请刷新后重试'
    };

    get videoElement() {
        return this.video?.nativeElement;
    }

    playBackRates = DEFAULT_PLAYBACK_RATES;

    private hostRenderer = useHostRenderer();

    constructor(public sanitizer: DomSanitizer, private ref: ElementRef) {
        super(sanitizer);
    }

    ngOnInit(): void {
        this.hostRenderer.addClass('thy-video-paused');
    }

    ngAfterViewInit() {}

    onCanPlay() {
        this.showErrorTip = false;

        const { playbackRate, currentTime, duration, paused, volume, muted } = this.videoElement;
        // this.videoElement = { playbackRate, currentTime, duration, paused, volume: volume * 100, muted };
        this.videoElement.ontimeupdate = this.onTimeUpdate;
        this.videoElement.onwaiting = this.onWaiting;
    }

    /**
     * 播放时间更新
     * 非禁用或当前时间为总时长重新设置进度
     */
    onTimeUpdate = () => {
        const { playbackRate, currentTime, duration, paused, muted } = this.videoElement;
        // this.videoElement = { ...this.videoElement, playbackRate, currentTime, duration, muted };
        if (currentTime === duration || !paused) {
            this.setProgressValue();
        }
    };

    onWaiting = () => {
        const { currentTime, duration, paused } = this.videoElement;
        if (currentTime === duration || !paused) {
            this.setProgressValue();
        }
    };

    playOrPause() {
        if (this.videoElement.paused) {
            if (this.videoElement?.duration) {
                this.onPlay();
                this.hostRenderer.addClass('thy-video-playing');
                this.hostRenderer.removeClass('thy-video-paused');
            }
        } else {
            this.onPause();
            this.hostRenderer.addClass('thy-video-paused');
            this.hostRenderer.removeClass('thy-video-playing');
        }
    }

    muted() {
        this.videoElement.muted = !this.videoElement.muted;
        this.videoElement.muted = !this.videoElement.muted;
    }

    /**
     * 进度条点击事件
     * 根据当前播放时间
     * 设置缓存值
     * buffered.end 取值为 0-1
     */
    afterProgressChange(value: number) {
        const { duration, buffered } = this.videoElement;

        const currentTime = (value / 100) * duration;
        // 防止 duration 值为NaN
        if (isFinite(currentTime)) {
            this.videoElement.currentTime = currentTime;
            const ratio = this.videoElement.currentTime / duration;
            if (ratio !== 0 && ratio !== 1) {
                this.bufferedValue = (((buffered?.end && buffered.end(ratio)) || 0) / duration) * 100;
            }
        }
    }

    afterVolumeChange(value: number) {
        this.videoElement.volume = value / 100;
    }

    /**
     * 设置进度以及缓存
     * 根据最新播放时间和总时长计算进度
     * 根据最新缓存和总时长重新计算缓存
     */
    setProgressValue() {
        const { currentTime, duration, buffered } = this.videoElement;
        let ratio = currentTime / duration;
        this.progressValue = Math.round(ratio * 100);
        if (ratio !== 0 && ratio !== 1) {
            const bufferedValue = (((buffered?.end && buffered.end(ratio)) || 0) / duration) * 100;
            this.bufferedValue = Math.round(bufferedValue);
        }
        if (this.progressValue === 100) {
            this.videoElement.currentTime = 0;
            this.setProgressValue();
        }
    }

    onMouseStart() {
        this.onPause();
    }

    onMouseEnd() {
        this.onPlay();
    }

    /**
     * 暂停播放
     * chrome 50后触发video.play会返回promise对象 播放失败会inject
     */
    onPause() {
        const playPromise = this.videoElement.play && this.videoElement.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.videoElement.pause();
                })
                .catch(() => {});
        }
    }

    playBackRateChange(rate: number) {
        this.videoElement.playbackRate = rate;
    }

    onPlay() {
        this.videoElement.play && this.videoElement.play();
    }

    onLoadedmetadata(event: Event) {
        this.thyLoadedMetadata.emit(this.video?.nativeElement);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
