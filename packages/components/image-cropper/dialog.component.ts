import { NgStyle } from '@angular/common';
import { Component, inject, input, model, NgZone, numberAttribute, OnInit, Optional, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectLocale } from '@tethys/pro/i18n';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyDialog, ThyDialogContainer, ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { ThySliderModule, ThySliderType } from 'ngx-tethys/slider';
import { ThyUploadModule } from 'ngx-tethys/upload';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ThyImageCropperComponent } from './cropper.component';
import { ThyCropperImageSize, ThyCropperShape, ThyCropperViewMode } from './cropper.entity';
import { ThyCropperSizeStylePipe, ThyCropperSizeTextPipe } from './cropper.pipe';

@Component({
    selector: 'thy-image-cropper-dialog',
    templateUrl: './dialog.component.html',
    host: {
        class: 'thy-dialog-content thy-image-cropper-dialog',
        '[class.thy-image-cropper-dialog-round]': 'shape() === "round"'
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
    readonly title = input<string>(this.locale().image, { alias: 'thyTitle' });

    /**
     * 预览大小（支持多个预览）
     */
    readonly previewSizes = input.required<ThyCropperImageSize[]>({ alias: 'thyPreviewSizes' });

    /**
     * 图片资源
     */
    readonly thyImage = input<File | string>('', { alias: 'thyImage' });

    readonly image = model<File | string>('');

    /**
     * 上传提示文案
     */
    readonly uploadTips = input<string>(this.locale().uploadTips, { alias: 'thyUploadTips' });

    /**
     * 上传指定文件后缀类型
     */
    readonly uploadAcceptType = input('.jpg,.png,.jpeg', { alias: 'thyUploadAcceptType' });

    /**
     * 上传,单位`kb`，`0`表示没有任何限制
     */
    readonly uploadSizeThreshold = input<number, unknown>(0, { alias: 'thyUploadSizeThreshold', transform: numberAttribute });

    /**
     * 图片裁剪模式
     */
    readonly viewMode = input<ThyCropperViewMode>(1, { alias: 'thyViewMode' });

    /**
     * 图片裁剪宽高比
     */
    readonly aspectRatio = input<number | undefined>(undefined, { alias: 'thyAspectRatio' });

    /**
     * 设置裁剪形状
     */
    readonly shape = input<ThyCropperShape>('rect', { alias: 'thyShape' });

    /**
     * 确定按钮回调方法
     */
    readonly confirmAction = input.required<(file: File) => Observable<any>>({ alias: 'thyConfirmAction' });

    /**
     * 确定事件
     */
    readonly thyConfirm = output<File | undefined>();

    readonly cropperRef = viewChild.required<ThyImageCropperComponent>('cropper');

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
    ) {
        // effect(() => {
        //     const image = this.thyImage();
        //     if (image) {
        //         this.image.set(image);
        //     }
        // });
    }

    ngOnInit(): void {}

    selectImage(image: { files: File[] }) {
        if (image.files.length > 0) {
            this.image.set(image.files[0]);
        }
        this.scale = 1;
        this.rotate = 0;
    }

    save() {
        const cropper = (this.cropperRef() as ThyImageCropperComponent).cropper;
        if (cropper) {
            this.saving = true;
            (cropper as Cropper).getCroppedCanvas().toBlob((blob) => {
                const file = new File([blob as Blob], 'avatar.png', { type: 'image/jpeg' });
                const confirmAction = this.confirmAction();
                if (confirmAction) {
                    confirmAction(file)
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
            this.thyConfirm.emit(undefined);
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
