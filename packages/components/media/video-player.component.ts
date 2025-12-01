import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    input,
    viewChild
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { useHostRenderer } from '@tethys/cdk/dom';
import { injectLocale } from '@tethys/pro/i18n';
import { coerceBooleanProperty } from 'ngx-tethys/util';
import { ThyVideoControlsComponent } from './controls.component';
import { DEFAULT_PLAYBACK_RATES, ThyMediaPlayerBaseComponent } from './media-base.component';

@Component({
    selector: 'thy-video-player',
    template: `
        @if (showMedia) {
            <video
                #videoElement
                class="media-content"
                [src]="fileSrc"
                [muted]="true"
                [autoplay]="thyAutoPlay()"
                (loadedmetadata)="onLoadedmetadata($event)"
                (error)="onError($event)"
                (canplay)="onCanPlay()"
            ></video>
        }
        @if (showErrorTip) {
            <div class="error-tip">
                {{ errorTipText }}
            </div>
        }
        <thy-video-controls #controls [thyMedia]="video" [thyProgressType]="thyProgressType()"></thy-video-controls>
    `,
    imports: [ThyVideoControlsComponent]
})
export class ThyVideoPlayerComponent extends ThyMediaPlayerBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding('class') class = 'thy-video-player thy-media-player';

    readonly videoElement = viewChild.required<ElementRef>('videoElement');

    readonly controls = viewChild.required<ThyVideoControlsComponent>('controls');

    locale = injectLocale();

    /**
     * 媒体资源的url
     */
    @Input() set thySrc(src: string | SafeUrl) {
        this.fileSrc = src;
    }

    /**
     * 当下载到足够播放的媒体文件，是否可以自动播放
     */
    readonly thyAutoPlay = input(false, { transform: coerceBooleanProperty });

    public errorTips = {
        formatError: this.locale().videoFormatError,
        networkError: this.locale().networkError
    };

    playBackRates = DEFAULT_PLAYBACK_RATES;

    private hostRenderer = useHostRenderer();

    public video!: ElementRef;

    constructor(
        public sanitizer: DomSanitizer,
        public cdr: ChangeDetectorRef
    ) {
        super(sanitizer);
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.video = this.videoElement();
        this.cdr.detectChanges();
    }

    onCanPlay() {
        this.showErrorTip = false;
        this.controls()?.onCanPlay && this.controls()?.onCanPlay();
    }

    onLoadedmetadata(event: Event) {
        this.thyLoadedMetadata.emit(this.video?.nativeElement);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
