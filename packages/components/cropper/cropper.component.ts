import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import Cropper from 'cropperjs';
import { ThyCropperOptions } from './cropper.entity';

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
    @Input() thyImage: string | undefined;

    /**
     * 图片加载的错误提示
     */
    @Input() thyImageErrorMessage: string = '图片加载错误';

    /**
     * 图片裁剪的选项
     */
    @Input('cropperOptions') cropperOptions: ThyCropperOptions = {
        viewMode: 2,
        aspectRatio: 1,
        dragMode: 'move' as Cropper.DragMode,
        cropBoxResizable: false,
        zoomable: true,
        guides: false,
        autoCrop: false,
        zoomOnWheel: true,
        checkCrossOrigin: true,
        preview: '.preview-image-warp',
        ready: (event) => {
            (this.cropper as Cropper).crop();
            return;
        }
    };

    /**
     * 图片裁剪的数据更改( blob)
     */
    @Output() thyCropped = new EventEmitter();

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

        if (this.cropperOptions.checkCrossOrigin) {
            image.crossOrigin = 'anonymous';
        }

        image.addEventListener('ready', () => {
            this.thyImageReady.emit(true);

            this.loadingDone = true;
        });

        this.cropperOptions = Object.assign(
            {
                ...defaultConfig,
                crop: (event: any) => {
                    this.crop();
                }
            },
            this.cropperOptions
        );

        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = undefined;
        }
        this.cropper = new Cropper(image, this.cropperOptions);
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
            this.thyCropped.emit(res);
        });
    }
}
