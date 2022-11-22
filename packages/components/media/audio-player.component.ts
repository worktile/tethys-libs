import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ThyMediaPlayerBaseComponent } from './media-base.component';

@Component({
    selector: 'thy-audio-player',
    template: `
        <div class="audio-content">
            <audio
                #audio
                class="audio"
                [src]="fileSrc"
                [muted]="thyMuted"
                [autoplay]="thyAutoplay"
                [controls]="thyControls"
                (loadedmetadata)="onLoadedmetadata($event)"
                (error)="onError($event)"
                (canplay)="onCanPlay()"
                *ngIf="showMedia"
            ></audio>
            <div class="error-tip" *ngIf="showErrorTip">
                {{ errorTipText }}
            </div>
        </div>
    `
})
export class ThyAudioPlayerComponent extends ThyMediaPlayerBaseComponent implements OnInit {
    @HostBinding('class') class = 'thy-audio-player thy-media-player';

    @ViewChild('audio') audio: ElementRef | undefined;

    public errorTips = {
        formatError: '该音频暂不支持预览，请升级浏览器版本或下载查看',
        networkError: '当前网络异常，请刷新后重试'
    };

    constructor(public sanitizer: DomSanitizer) {
        super(sanitizer);
    }

    onLoadedmetadata(event: Event) {
        const duration = this.audio?.nativeElement?.duration;
        if (!(duration && duration > 0)) {
            this.showMedia = false;
        }
    }
}
