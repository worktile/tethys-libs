import { Component, EventEmitter, HostBinding, inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { isString } from '@tethys/cdk/is';
import { ThyDialog, ThyDialogContainerComponent } from 'ngx-tethys/dialog';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ThyCropperComponent } from '../cropper.component';
import { ThyCropperImageSize } from '../cropper.entity';

@Component({
    selector: 'thy-cropper-dialog',
    templateUrl: './dialog.component.html'
})
export class ThyCropperDialogComponent implements OnInit {
    @HostBinding('class') className = 'thy-dialog-content thy-cropper-dialog';

    /**
     * 标题
     */
    @Input() thyTitle: string = '图片';

    /**
     * 默认大小
     */
    @Input('thySize') size: ThyCropperImageSize = { width: '120px', height: '120px' };

    /**
     * 预览大小（支持多个预览）
     */
    @Input('thyPreviewSizes') previewSizes!: ThyCropperImageSize[];

    /**
     * 图片资源的url
     */
    @Input('thyImage') set image(value: File | string) {
        if (!isString(value)) {
            this.imageFile = value;
            this.setImageSrc();
        } else {
            this.imageSrc = value;
        }
    }

    @ViewChild('cropper', { static: true }) cropperRef!: ThyCropperComponent;

    /**
     * 确定按钮回调
     */
    @Input() thyConfirmAction: ((file: File) => Observable<any>) | undefined;

    /**
     * 确定事件
     */
    @Output() thyConfirm = new EventEmitter();

    // 图片文件
    imageFile: File | undefined;

    // 图片资源的url
    imageSrc: string | undefined;

    saving = false;

    notifyService = inject(ThyNotifyService);

    constructor(public dialog: ThyDialog, public dialogContainer: ThyDialogContainerComponent, private ngZone: NgZone) {}

    ngOnInit(): void {}

    selectImage(image: { files: File[] }) {
        if (image.files.length > 0) {
            this.imageFile = image.files[0];
            this.setImageSrc();
        }
    }

    setImageSrc() {
        const reader = new FileReader();
        reader.onloadend = () => {
            const cropperRef = (this.cropperRef as ThyCropperComponent)?.cropper;
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

    save() {
        this.thyConfirm.emit();
        const cropper = (this.cropperRef as ThyCropperComponent).cropper;
        if (cropper) {
            this.saving = true;
            (cropper as Cropper).getCroppedCanvas().toBlob((blob) => {
                const file = new File([blob as Blob], 'avatar.png', { type: 'image/jpeg' });
                if (this.thyConfirmAction) {
                    this.thyConfirmAction(file)
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
                    this.saving = false;
                }
            });
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
