import { NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ThyAudioControlsComponent } from './audio-controls.component';
import { ThyVideoControlsComponent } from './controls.component';
import { ThyMediaPlayerBaseComponent } from './media-base.component';
import { ThyMediaProgressComponent } from './progress.component';

@Component({
    selector: 'thy-audio-player',
    template: `
        <div class="media-content audio-content">
            <audio
                #audioElement
                class="audio"
                [src]="fileSrc"
                [muted]="false"
                [autoplay]="thyAutoPlay"
                (loadedmetadata)="onLoadedmetadata($event)"
                (error)="onError($event)"
                (canplay)="onCanPlay()"
                *ngIf="showMedia"
            ></audio>
            <thy-audio-controls
                #controls
                [thyMedia]="audio"
                [thyErrorTips]="errorTipText"
                [thyProgressType]="thyProgressType"
                [thyFileName]="fileName"
                [thyFileSize]="thyFileSize"
            >
            </thy-audio-controls>
        </div>
    `,
    standalone: true,
    imports: [NgIf, ThyMediaProgressComponent, ThyAudioControlsComponent]
})
export class ThyAudioPlayerComponent extends ThyMediaPlayerBaseComponent implements OnInit, AfterViewInit {
    @HostBinding('class') class = 'thy-audio-player thy-media-player';

    @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

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

    /**
     * 文件大小
     */
    @Input() thyFileSize!: number;

    /**
     * 文件名称
     */
    @Input() set thyFileName(name: string) {
        this.fileName = name;
    }

    public errorTips = {
        formatError: '该音频暂不支持预览，请升级浏览器版本或下载查看',
        networkError: '当前网络异常，请刷新后重试'
    };

    public fileName!: string;

    public audio!: ElementRef;

    constructor(public sanitizer: DomSanitizer, public cdr: ChangeDetectorRef) {
        super(sanitizer);
    }

    ngAfterViewInit() {
        this.audio = this.audioElement;
        this.cdr.detectChanges();
    }

    onLoadedmetadata(event: Event) {
        this.thyLoadedMetadata.emit(this.audio?.nativeElement);
    }

    onCanPlay() {
        const { src } = this.audio?.nativeElement;

        const match = src.match(/([^\/]+\.mp3|[^\/]+\.(wav|ogg|flac|aac|m4a))$/i);

        this.fileName = this.fileName || (match && match[0]) || '';

        this.controls.onCanPlay && this.controls.onCanPlay();
    }
}
