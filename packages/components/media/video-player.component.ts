import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ThyMediaPlayerBaseComponent } from './media-base.component';

@Component({
    selector: 'thy-video-player',
    template: `
        <video
            #video
            class="media-content"
            [src]="fileSrc"
            [muted]="thyMuted"
            [autoplay]="thyAutoplay"
            [controls]="thyControls"
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
