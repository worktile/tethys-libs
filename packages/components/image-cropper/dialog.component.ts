import { Component, EventEmitter, inject, Input, NgZone, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { InputNumber } from 'ngx-tethys/core';
import { ThyDialog, ThyDialogContainer, ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { ThySliderType, ThySliderModule } from 'ngx-tethys/slider';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ThyImageCropperComponent } from './cropper.component';
import { ThyCropperImageSize, ThyCropperShape, ThyCropperViewMode } from './cropper.entity';
import { ThyCropperSizeTextPipe, ThyCropperSizeStylePipe } from './cropper.pipe';
import { NgStyle } from '@angular/common';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyUploadModule } from 'ngx-tethys/upload';
import { ThyButtonModule } from 'ngx-tethys/button';
import { FormsModule } from '@angular/forms';
import { injectLocale } from '@tethys/pro/i18n';

@Component({
    selector: 'thy-image-cropper-dialog',
    templateUrl: './dialog.component.html',
    host: {
        class: 'thy-dialog-content thy-image-cropper-dialog',
        '[class.thy-image-cropper-dialog-round]': 'shape === "round"'
    },
    imports: [
        ThyDialogModule,
        ThyImageCropperComponent,
        ThySliderModule,
        FormsModule,
        ThyButtonModule,
        ThyUploadModule,
        ThyIcon,
        NgStyle,
        ThyCropperSizeTextPipe,
        ThyCropperSizeStylePipe
    ]
})
export class ThyImageCropperDialogComponent implements OnInit {
    locale = injectLocale();

    /**
     * 标题
     * @default 图片
     */
    @Input('thyTitle') title: string = this.locale().image;

    /**
     * 预览大小（支持多个预览）
     */
    @Input('thyPreviewSizes') previewSizes!: ThyCropperImageSize[];

    /**
     * 图片资源
     */
    @Input('thyImage') image!: File | string;

    /**
     * 上传提示文案
     */
    @Input('thyUploadTips') uploadTips: string = this.locale().uploadTips;

    /**
     * 上传指定文件后缀类型
     */
    @Input('thyUploadAcceptType')
    uploadAcceptType = '.jpg,.png,.jpeg';

    /**
     * 上传,单位`kb`，`0`表示没有任何限制
     */
    @Input('thyUploadSizeThreshold')
    @InputNumber()
    uploadSizeThreshold!: number;

    /**
     * 图片裁剪模式
     */
    @Input('thyViewMode') viewMode!: ThyCropperViewMode;

    /**
     * 图片裁剪宽高比
     */
    @Input('thyAspectRatio') aspectRatio!: number;

    /**
     * 设置裁剪形状
     */
    @Input('thyShape') shape: ThyCropperShape = 'rect';

    /**
     * 确定按钮回调方法
     */
    @Input('thyConfirmAction') confirmAction!: (file: File) => Observable<any>;

    /**
     * 确定事件
     */
    @Output() thyConfirm: EventEmitter<File> = new EventEmitter<File>();

    @ViewChild('cropper', { static: true }) cropperRef!: ThyImageCropperComponent;

    saving = false;

    notifyService = inject(ThyNotifyService);

    scale = 1;

    rotate = 0;

    scaleConfig = {
        maxScale: 3,
        minScale: 0.6,
        step: 0.1
    };

    sliderType: ThySliderType = 'primary';

    constructor(
        public dialog: ThyDialog,
        @Optional() public dialogContainer: ThyDialogContainer,
        private ngZone: NgZone
    ) {}

    ngOnInit(): void {}

    selectImage(image: { files: File[] }) {
        if (image.files.length > 0) {
            this.image = image.files[0];
        }
        this.scale = 1;
        this.rotate = 0;
    }

    save() {
        const cropper = (this.cropperRef as ThyImageCropperComponent).cropper;
        if (cropper) {
            this.saving = true;
            (cropper as Cropper).getCroppedCanvas().toBlob((blob) => {
                const file = new File([blob as Blob], 'avatar.png', { type: 'image/jpeg' });
                if (this.confirmAction) {
                    this.confirmAction(file)
                        .pipe(
                            finalize(() => {
                                this.saving = false;
                            })
                        )
                        .subscribe(
                            () => {
                                this.close();
                            },
                            (error) => {
                                this.notifyService.error(error);
                            }
                        );
                } else {
                    this.thyConfirm.emit(file);
                    this.saving = false;
                }
            });
        } else {
            this.thyConfirm.emit();
        }
    }

    close() {
        if (this.dialogContainer) {
            this.ngZone.run(() => {
                this.dialog.close();
            });
        }
    }

    setRotate() {
        this.rotate = this.rotate + 90;
    }
}
