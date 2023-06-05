import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { isString } from '@tethys/cdk';
import { MixinBase, mixinUnsubscribe } from 'ngx-tethys/core';
import { ThySliderType } from 'ngx-tethys/slider';

export const DEFAULT_PLAYBACK_RATES = [0.5, 1, 1.25, 1.5, 2];

/**
 * @internal
 */
@Directive({ selector: '[thyMediaPlayerBase]' })
export class ThyMediaPlayerBaseComponent extends mixinUnsubscribe(MixinBase) implements OnInit {
    public errorTips!: { formatError: string; networkError: string };

    public showErrorTip = false;

    public showMedia = true;

    public errorTipText: string = '';

    public set fileSrc(value: string | SafeUrl) {
        if (isString(value)) {
            this.internalFileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(value);
        } else {
            this.internalFileSrc = value;
        }
    }

    public get fileSrc() {
        return this.internalFileSrc;
    }

    private internalFileSrc: SafeUrl = '';

    mediaOptions = {
        playbackRate: 1,
        currentTime: 0,
        duration: 0,
        paused: true,
        volume: 0
    };

    /**
     * 缓存值（0-100）
     */
    bufferedValue = 0;

    /**
     * 进度值（0-100）
     */
    progressValue = 0;

    /**
     * 进度类型
     */
    @Input() thyProgressType: ThySliderType | undefined;

    /**
     * 进度颜色
     */
    @Input() thyProgressColor: undefined;

    /**
     * 媒体元数据被加载完成后触发 能拿到媒体尺寸、时长等
     */
    @Output() thyLoadedMetadata: EventEmitter<HTMLVideoElement | HTMLAudioElement> = new EventEmitter();

    constructor(public sanitizer: DomSanitizer) {
        super();
    }

    ngOnInit(): void {}

    onLoadedmetadata(event: Event) {}

    onCanPlay() {
        this.showErrorTip = false;
    }

    onError(event: Event) {
        const errorCode = (event.target as HTMLMediaElement).error?.code;

        if (errorCode === 3 || errorCode === 4) {
            this.errorTipText = this.errorTips['formatError'];
        } else {
            this.errorTipText = this.errorTips['networkError'];
        }
        setTimeout(() => {
            this.showErrorTip = true;
        }, 1000);
    }
}
