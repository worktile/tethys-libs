import {
    Component,
    ElementRef,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    effect,
    input,
    numberAttribute,
    output,
    viewChild
} from '@angular/core';
import { isString } from '@tethys/cdk';
import Cropper from 'cropperjs';
import { ThyCropperOptions, ThyCropperShape, ThyCropperViewMode, thyCropDataChangeEvent } from './cropper.entity';

import { injectLocale } from '@tethys/pro/i18n';
import { ThyLoadingModule } from 'ngx-tethys/loading';

@Component({
    selector: 'thy-image-cropper',
    templateUrl: './cropper.component.html',
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.thy-image-cropper-round]': 'thyShape() === "round"'
    },
    imports: [ThyLoadingModule]
})
export class ThyImageCropperComponent implements OnInit {
    @HostBinding('class.thy-image-cropper') cropperClass = true;

    readonly image = viewChild.required<ElementRef>('image');

    locale = injectLocale();

    /**
     * 图片资源
     */
    readonly thyImage = input.required<File | string>({ alias: 'thyImage' });

    /**
     * 图片加载的错误提示
     * @default 图片加载错误
     */
    readonly thyImageErrorMessage = input<string>(this.locale().imageErrorMessage);

    /**
     * 图片裁剪模式
     */
    readonly thyViewMode = input<ThyCropperViewMode>();

    /**
     * 图片裁剪宽高比
     */
    readonly thyAspectRatio = input<number>();

    /**
     * 设置裁剪形状
     */
    readonly thyShape = input<ThyCropperShape>('rect');

    /**
     * 设置放大缩小
     */
    readonly thyScale = input<number, unknown>(1, { transform: numberAttribute });

    /**
     * 设置旋转角度
     */
    readonly thyRotate = input<number, unknown>(undefined, { transform: numberAttribute });

    /**
     * 图片裁剪的数据更改(blob)
     */
    readonly thyCropDataChanged = output<thyCropDataChangeEvent>();

    /**
     * 图片加载完毕事件
     */
    readonly thyImageReady = output<boolean>();

    public loadingDone = false;

    public cropper: Cropper | undefined;

    public loadError: boolean = false;

    // 图片文件
    private imageFile!: File;

    // 图片资源的url
    public imageSrc!: string;

    defaultCropperOptions: ThyCropperOptions = {
        viewMode: 1,
        aspectRatio: 1,
        movable: false,
        scalable: true,
        dragMode: 'move' as Cropper.DragMode,
        cropBoxResizable: false,
        zoomable: true,
        guides: false,
        autoCrop: false,
        zoomOnWheel: true,
        checkCrossOrigin: true,
        preview: '.preview-image-warp',
        ready: (event) => {
            this.loadingDone = true;
            (this.cropper as Cropper).crop();
            return;
        }
    };

    cropperOptions!: ThyCropperOptions;

    constructor() {
        effect(() => {
            const scale = this.thyScale();
            (this.cropper as Cropper)?.scale(scale);
        });

        effect(() => {
            const rotate = this.thyRotate();
            (this.cropper as Cropper)?.rotateTo(rotate as number);
        });

        effect(() => {
            const image = this.thyImage();
            if (image) {
                if (!isString(image)) {
                    this.imageFile = image;
                    this.setImageSrc();
                } else {
                    this.imageSrc = image;
                }
            } else {
                this.onError();
            }
        });
    }

    ngOnInit() {}

    onLoad(event: Event) {
        this.loadError = false;

        const image = event.target as HTMLImageElement;

        image.addEventListener('ready', () => {
            this.thyImageReady.emit(true);
        });

        const { viewMode, aspectRatio } = this.defaultCropperOptions;

        const thyViewMode = this.thyViewMode();
        const thyAspectRatio = this.thyAspectRatio();
        const customCropperOptions = {
            viewMode: thyViewMode || thyViewMode === 0 ? thyViewMode : viewMode,
            aspectRatio: thyAspectRatio ? thyAspectRatio : aspectRatio
        };

        this.cropperOptions = Object.assign(
            {
                ...this.defaultCropperOptions,
                crop: (event: any) => {
                    this.crop();
                }
            },
            customCropperOptions
        );

        if (this.cropperOptions?.checkCrossOrigin) {
            image.crossOrigin = 'anonymous';
        }

        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = undefined;
        }
        this.cropper = new Cropper(image, this.cropperOptions);
    }

    onError(event?: Event) {
        this.loadError = true;
        this.loadingDone = true;
    }

    crop = () => {
        const cropper = this.cropper as Cropper;
        const canvas = cropper.getCroppedCanvas();
        const promise = new Promise((resolve) => {
            canvas.toBlob((blob) => resolve({ blob }));
        });

        promise.then((res) => {
            return this.thyCropDataChanged.emit(res as thyCropDataChangeEvent);
        });
    };

    setImageSrc() {
        this.loadingDone = false;
        const reader = new FileReader();
        reader.onloadend = () => {
            const cropperRef = this.cropper;
            if (cropperRef) {
                cropperRef.destroy();
                cropperRef.replace((reader.result as ArrayBuffer).toString(), true);
                cropperRef.reset();
            }
            this.imageSrc = (reader.result as ArrayBuffer).toString();
        };
        if (this.imageFile) {
            reader.readAsDataURL(this.imageFile);
        } else {
            this.imageSrc = '';
        }
    }
}
