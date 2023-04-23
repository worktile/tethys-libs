import { Directive, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { isString } from '@tethys/cdk';

/**
 * @internal
 */
@Directive({ selector: '[thyMediaPlayerBase]' })
export class ThyMediaPlayerBaseComponent implements OnInit {
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

    /**
     * 媒体元数据被加载完成后触发 能拿到媒体尺寸、时长等
     */
    @Output() thyLoadedMetadata: EventEmitter<HTMLVideoElement | HTMLAudioElement> = new EventEmitter();

    constructor(public sanitizer: DomSanitizer) {}

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
