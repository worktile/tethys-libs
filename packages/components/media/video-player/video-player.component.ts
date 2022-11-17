import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'thy-video-player',
    templateUrl: './video-player.component.html'
})
export class ThyVideoPlayerComponent implements OnInit {
    @HostBinding('class') class = 'thy-video-preview';

    private errorTips = {
        formatError: '该视频暂不支持预览，请升级浏览器版本或下载查看',
        networkError: '当前网络异常，请刷新后重试'
    };

    @Input() fileSrc: SafeUrl = '';

    showErrorTip = false;

    showVideo = true;

    errorTipText: string = '';

    constructor() {}

    ngOnInit(): void {}

    onVideoLoadedmetadata(event: Event) {
        if (!(event.target as HTMLVideoElement).videoWidth || !(event.target as HTMLVideoElement).videoHeight) {
            this.showVideo = false;
            this.showErrorTip = true;
            this.errorTipText = this.errorTips['formatError'];
        }
    }

    onVideoCanPlay() {
        this.showErrorTip = false;
    }

    onVideoError(event: Event) {
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
