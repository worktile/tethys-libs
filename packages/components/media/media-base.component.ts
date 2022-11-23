import { Directive, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

/**
 * @internal
 */
@Directive({ selector: '[thyMediaPlayerBase]' })
export class ThyMediaPlayerBaseComponent implements OnInit {
    errorTips!: { formatError: string; networkError: string };

    public fileSrc: SafeUrl = '';

    public showErrorTip = false;

    public showMedia = true;

    public errorTipText: string = '';

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
