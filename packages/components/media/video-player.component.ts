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
            [muted]="false"
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
                    <a href="javascript:;" class="play" (click)="playOrPause()">
                        {{ mediaOptions.paused ? '开始' : '暂停' }}
                        <!-- <thy-icon [thyIconName]="mediaOptions.paused ? : 'play-circle' : 'pause-circle'"></thy-icon> -->
                    </a>
                    <div class="time">{{ mediaOptions.currentTime | thyTimeFormat }} / {{ mediaOptions.duration | thyTimeFormat }}</div>
                </div>
                <div class="d-flex">
                    <div class="volume-bar-wrap">
                        <thy-icon [thyIconName]="'play-circle'"></thy-icon>
                        <thy-media-progress
                            class="volume-bar"
                            [thyProgressValue]="mediaOptions.volume"
                            [thyProgressType]="thyProgressType"
                            (thyAfterChange)="afterVolumeChange($event)"
                        ></thy-media-progress>
                    </div>

                    <a thyAction [thyDropdown]="menu" class="volume" thyIcon="app-bulletin" href="javascript:;">倍速</a>

                    <thy-dropdown-menu #menu>
                        <a
                            [class.active]="mediaOptions.playbackRate === item"
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

        const { playbackRate, currentTime, duration, paused, volume } = this.videoElement;
        this.mediaOptions = { playbackRate, currentTime, duration, paused, volume: volume * 100 };
        this.videoElement.ontimeupdate = this.onTimeUpdate;
        this.videoElement.onwaiting = this.onWaiting;
    }

    /**
     * 播放时间更新
     * 非禁用或当前时间为总时长重新设置进度
     */
    onTimeUpdate = () => {
        const { playbackRate, currentTime, duration, paused } = this.videoElement;
        this.mediaOptions = { ...this.mediaOptions, playbackRate, currentTime, duration };
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
            this.onPlay();
            this.hostRenderer.addClass('thy-video-playing');
            this.hostRenderer.removeClass('thy-video-paused');
        } else {
            this.onPause();
            this.hostRenderer.addClass('thy-video-paused');
            this.hostRenderer.removeClass('thy-video-playing');
        }
    }

    onLoadedmetadata(event: Event) {}

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
        this.mediaOptions.volume = value;
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
                    this.mediaOptions.paused = this.videoElement.paused;
                })
                .catch(() => {});
        }
    }

    playBackRateChange(rate: number) {
        this.videoElement.playbackRate = rate;
        this.mediaOptions.playbackRate = rate;
    }

    onPlay() {
        this.videoElement.play && this.videoElement.play();
        this.mediaOptions.paused = this.videoElement.paused;
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
