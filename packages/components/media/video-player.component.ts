import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { useHostRenderer } from '@tethys/cdk/dom';
import { ThyMediaControlsComponent } from './controls.component';
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
            (loadedmetadata)="onLoadedmetadata($event)"
            (error)="onError($event)"
            (canplay)="onCanPlay()"
            *ngIf="showMedia"
        ></video>
        <div class="error-tip" *ngIf="showErrorTip">
            {{ errorTipText }}
        </div>
        <thy-media-controls
            #controls
            [thyMedia]="video"
            [thyProgressColor]="thyProgressColor"
            [thyProgressType]="thyProgressType"
        ></thy-media-controls>
    `
})
export class ThyVideoPlayerComponent extends ThyMediaPlayerBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding('class') class = 'thy-video-player thy-media-player';

    @ViewChild('video') video!: ElementRef;

    @ViewChild('controls') controls!: ThyMediaControlsComponent;

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

    playBackRates = DEFAULT_PLAYBACK_RATES;

    private hostRenderer = useHostRenderer();

    constructor(public sanitizer: DomSanitizer, private ref: ElementRef) {
        super(sanitizer);
    }

    ngOnInit(): void {}

    ngAfterViewInit() {}

    onCanPlay() {
        this.showErrorTip = false;
        this.controls.onCanPlay && this.controls.onCanPlay();
    }

    onLoadedmetadata(event: Event) {
        this.thyLoadedMetadata.emit(this.video?.nativeElement);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
