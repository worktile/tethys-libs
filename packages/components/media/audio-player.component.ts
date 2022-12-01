import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { isString } from '@tethys/cdk';
import { ThyMediaPlayerBaseComponent } from './media-base.component';

@Component({
    selector: 'thy-audio-player',
    template: `
        <div class="audio-content">
            <audio
                #audio
                class="audio"
                [src]="fileSrc"
                [muted]="false"
                [autoplay]="thyAutoPlay"
                [controls]="true"
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
    @HostBinding('class.thy-audio-player') audioPlayerClass = true;

    @ViewChild('audio') audio: ElementRef | undefined;

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
        formatError: '该音频暂不支持预览，请升级浏览器版本或下载查看',
        networkError: '当前网络异常，请刷新后重试'
    };

    constructor(public sanitizer: DomSanitizer) {
        super(sanitizer);
    }

    onLoadedmetadata(event: Event) {
        const duration = this.audio?.nativeElement?.duration;
        if (!(duration && duration > 0)) {
            this.showErrorTip = true;
        }
    }
}
