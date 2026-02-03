import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnInit,
    input,
    model,
    viewChild
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { injectLocale } from '@tethys/pro/i18n';
import { coerceBooleanProperty } from 'ngx-tethys/util';
import { ThyAudioControlsComponent } from './audio-controls.component';
import { ThyVideoControlsComponent } from './controls.component';
import { ThyMediaPlayerBaseComponent } from './media-base.component';

@Component({
    selector: 'thy-audio-player',
    template: `
        <div class="media-content audio-content">
            @if (showMedia) {
                <audio
                    #audioElement
                    class="audio"
                    [src]="thySrc"
                    [muted]="false"
                    [autoplay]="thyAutoPlay()"
                    (loadedmetadata)="onLoadedmetadata($event)"
                    (error)="onError($event)"
                    (canplay)="onCanPlay()"
                ></audio>
            }
            <thy-audio-controls
                #controls
                [thyMedia]="audio"
                [thyErrorTips]="errorTipText"
                [thyProgressType]="thyProgressType()"
                [thyFileName]="thyFileName()"
                [thyFileSize]="thyFileSize()"
            >
            </thy-audio-controls>
        </div>
    `,
    imports: [ThyAudioControlsComponent]
})
export class ThyAudioPlayerComponent extends ThyMediaPlayerBaseComponent implements OnInit, AfterViewInit {
    @HostBinding('class') class = 'thy-audio-player thy-media-player';

    readonly audioElement = viewChild.required<ElementRef<HTMLAudioElement>>('audioElement');

    readonly controls = viewChild.required<ThyVideoControlsComponent>('controls');

    locale = injectLocale();

    /**
     * 媒体资源的url
     * angular 21.0.4 到 21.1.0 版本中，当 audio[src] 经过 bypassSecurityTrustResourceUrl 转换后，编译阶段不会清理
     */
    @Input() thySrc: string | SafeUrl = '';

    /**
     * 当下载到足够播放的媒体文件，是否可以自动播放
     */
    readonly thyAutoPlay = input(false, { transform: coerceBooleanProperty });

    /**
     * 文件大小
     */
    readonly thyFileSize = input.required<number | string>();

    /**
     * 文件名称
     */
    readonly thyFileName = model<string>('');

    public errorTips = {
        formatError: this.locale().audioFormatError,
        networkError: this.locale().networkError
    };

    public audio!: ElementRef;

    constructor(
        public sanitizer: DomSanitizer,
        public cdr: ChangeDetectorRef
    ) {
        super(sanitizer);
    }

    ngAfterViewInit() {
        this.audio = this.audioElement();
        this.cdr.detectChanges();
    }

    onLoadedmetadata(event: Event) {
        this.thyLoadedMetadata.emit(this.audio?.nativeElement);
    }

    onCanPlay() {
        const { src } = this.audio?.nativeElement;

        const match = src.match(/([^\/]+\.mp3|[^\/]+\.(wav|ogg|flac|aac|m4a))$/i);

        this.thyFileName.set(this.thyFileName() || (match && match[0]) || '');

        this.controls()?.onCanPlay && this.controls()?.onCanPlay();
    }
}
