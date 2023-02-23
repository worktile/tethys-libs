import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import Cropper from 'cropperjs';

export interface ImageCropperSetting {
    width: number;
    height: number;
}

export interface CropperData {
    blob: Blob;
}

export const defaultConfig = {
    aspectRatio: 1,
    movable: false,
    scalable: false,
    zoomable: false,
    viewMode: 1,
    checkCrossOrigin: true
};

@Component({
    selector: 'thy-cropper',
    templateUrl: './cropper.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ThyCropperComponent implements OnInit {
    @HostBinding('class.thy-cropper') cropperClass = true;

    @ViewChild('image', { static: true }) image: ElementRef | undefined;

    /**
     * 图片资源的url
     */
    @Input() thySrc: string | undefined;

    /**
     * 图片裁剪的盒子
     */
    @Input() thyCropBox: Cropper.CropBoxData | undefined;

    /**
     * 图片加载的错误提示
     */
    @Input() thyLoadErrorText: string = '图片加载错误';

    /**
     * 图片裁剪的选项
     */
    @Input() thyCropperOptions: Cropper.Options = {};

    /**
     * 图片裁剪的数据( blob)
     */
    @Output() thyCropperData = new EventEmitter<CropperData>();

    /**
     * 图片加载完毕事件
     */
    @Output() thyImageReady = new EventEmitter();

    public loadingDone = false;

    public cropper: Cropper | undefined;

    public loadError: boolean = false;

    constructor() {}

    ngOnInit() {}

    onLoad(event: Event) {
        this.loadError = false;

        const image = event.target as HTMLImageElement;

        if (this.thyCropperOptions.checkCrossOrigin) {
            image.crossOrigin = 'anonymous';
        }

        image.addEventListener('ready', () => {
            this.thyImageReady.emit(true);

            this.loadingDone = true;

            if (this.thyCropBox) {
                (this.cropper as Cropper).setCropBoxData(this.thyCropBox);
            }
        });

        this.thyCropperOptions = Object.assign(
            {
                ...defaultConfig,
                crop: (event: any) => {
                    this.crop();
                }
            },
            this.thyCropperOptions
        );

        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = undefined;
        }
        this.cropper = new Cropper(image, this.thyCropperOptions);
    }

    onError(event: any) {
        this.loadError = true;
        this.loadingDone = true;
    }

    crop() {
        const cropper = this.cropper as Cropper;
        const canvas = cropper.getCroppedCanvas();
        const promise = new Promise((resolve) => {
            canvas.toBlob((blob) => resolve({ blob }));
        });

        promise.then((res) => {
            this.thyCropperData.emit(res as CropperData);
        });
    }
}
