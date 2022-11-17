import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'thy-audio-player',
    templateUrl: './audio-player.component.html'
})
export class ThyAudioPlayerComponent implements OnInit {
    @HostBinding('class') class = 'audio-preview-container';

    private errorTips = {
        formatError: '该音频暂不支持预览，请升级浏览器版本或下载查看',
        networkError: '当前网络异常，请刷新后重试'
    };

    @Input() fileSrc: SafeUrl = '';

    showErrorTip = false;

    showAudio = true;

    errorTipText: string = '';

    constructor() {}

    ngOnInit(): void {}

    onAudioLoadedmetadata(event: Event) {}

    onAudioCanPlay() {
        this.showErrorTip = false;
    }

    onAudioError(event: Event) {
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
