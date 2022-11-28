import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ThyMediaPlayerBaseComponent } from './media-base.component';

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
    `
})
export class ThyVideoPlayerComponent extends ThyMediaPlayerBaseComponent implements OnInit {
    @HostBinding('class') class = 'thy-video-player thy-media-player';

    @ViewChild('video') video: HTMLVideoElement | undefined;

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

    constructor(public sanitizer: DomSanitizer) {
        super(sanitizer);
    }

    ngOnInit(): void {}

    onLoadedmetadata(event: Event) {
        if (!(event.target as HTMLVideoElement).videoWidth || !(event.target as HTMLVideoElement).videoHeight) {
            this.showMedia = false;
            this.showErrorTip = true;
            this.errorTipText = this.errorTips['formatError'];
        }
    }
}
