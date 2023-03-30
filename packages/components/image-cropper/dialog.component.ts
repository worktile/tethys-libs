import { Component, EventEmitter, HostBinding, inject, Input, NgZone, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { ThyDialog, ThyDialogContainerComponent } from 'ngx-tethys/dialog';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ThyImageCropperComponent } from './cropper.component';
import { ThyCropperImageSize, ThyCropperViewMode } from './cropper.entity';

@Component({
    selector: 'thy-image-cropper-dialog',
    templateUrl: './dialog.component.html'
})
export class ThyImageCropperDialogComponent implements OnInit {
    @HostBinding('class') className = 'thy-dialog-content thy-image-cropper-dialog';

    /**
     * 标题
     * @default 图片
     */
    @Input('thyTitle') title: string = '图片';

    /**
     * 默认预览大小
     * @default { width: '120px', height: '120px' }
     */
    @Input('thySize') size: ThyCropperImageSize = { width: '120px', height: '120px' };

    /**
     * 预览大小（支持多个预览）
     */
    @Input('thyPreviewSizes') previewSizes!: ThyCropperImageSize[];

    /**
     * 图片资源
     */
    @Input('thyImage') image!: File | string;

    /**
     * 图片资源
     */
    @Input('thyUploadTips') uploadTips: string = '(最佳尺寸 120X120 像素，可以上传高质量图片进行裁剪)';

    /**
     * 图片裁剪模式
     */
    @Input('thyCropperViewMode') cropperViewMode!: ThyCropperViewMode;

    /**
     * 图片裁剪宽高比
     */
    @Input('thyCropperAspectRatio') cropperAspectRatio!: number;

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

    constructor(public dialog: ThyDialog, @Optional() public dialogContainer: ThyDialogContainerComponent, private ngZone: NgZone) {}

    ngOnInit(): void {}

    selectImage(image: { files: File[] }) {
        if (image.files.length > 0) {
            this.image = image.files[0];
        }
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
}
