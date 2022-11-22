import { Directive, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Directive({ selector: '[thyMediaPlayerBase]' })
export class ThyMediaPlayerBaseComponent implements OnInit {
    /**
     * 媒体资源的url
     */
    @Input() set thyFileSrc(src: string) {
        this.fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(src);
    }

    /**
     * 控制媒体的控制条是否显示
     */
    @Input() thyControls: boolean = true;

    /**
     * 媒体元素是否被禁音
     */
    @Input() thyMuted: boolean = false;

    /**
     * 当下载到足够播放的媒体文件，是否可以自动播放
     */
    @Input() thyAutoplay: boolean = true;

    protected errorTips = {
        formatError: '该视频暂不支持预览，请升级浏览器版本或下载查看',
        networkError: '当前网络异常，请刷新后重试'
    };

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
