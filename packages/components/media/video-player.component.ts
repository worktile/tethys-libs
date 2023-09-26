import { NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { useHostRenderer } from '@tethys/cdk/dom';
import { ThyVideoControlsComponent } from './controls.component';
import { DEFAULT_PLAYBACK_RATES, ThyMediaPlayerBaseComponent } from './media-base.component';

@Component({
    selector: 'thy-video-player',
    template: `
        <video
            #videoElement
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
        <thy-video-controls #controls [thyMedia]="video" [thyProgressType]="thyProgressType"></thy-video-controls>
    `,
    standalone: true,
    imports: [NgIf, ThyVideoControlsComponent]
})
export class ThyVideoPlayerComponent extends ThyMediaPlayerBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding('class') class = 'thy-video-player thy-media-player';

    @ViewChild('videoElement') videoElement!: ElementRef;

    @ViewChild('controls') controls!: ThyVideoControlsComponent;

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

    public video!: ElementRef;

    constructor(public sanitizer: DomSanitizer, public cdr: ChangeDetectorRef) {
        super(sanitizer);
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.video = this.videoElement;
        this.cdr.detectChanges();
    }

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
