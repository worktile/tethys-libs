import { Component, ElementRef, HostBinding, inject, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ThyCropperComponent } from '../cropper.component';

@Component({
    selector: 'thy-pro-cropper-preview',
    templateUrl: './preview.component.html'
})
export class ThyProCropperPreviewComponent implements OnInit {
    @HostBinding('class') className = 'thy-dialog-content thy-pro-cropper-preview';

    /**
     * 上传图标
     */
    @Input() thyUploadAction: ((file: File) => Observable<any>) | undefined;

    /**
     * 标题
     */
    @Input() thyTitle: string = '图片';

    /**
     * 图片裁剪的选项
     */
    @Input() set thyCropperOptions(value: Cropper.Options) {
        this.cropperOptions = value;
    }

    /**
     * 图片资源的url
     */
    @Input() set thySrc(src: string) {
        this.src = src;
    }

    @ViewChild('cropper', { static: true }) cropperRef: ThyCropperComponent | undefined;

    @ViewChild('defaultAvatar', { static: true }) defaultAvatar: ElementRef | undefined;

    @ViewChild('smAvatar', { static: true }) smAvatar: ElementRef | undefined;

    /**
     * cropperOptions
     * viewMode 视图模式，选项为 0（移动没有限制）、 1（图片只能再图片内移动而不是整个容器） 、2（图片不全部铺满容器） 、3（图片填充整个容器），default：0，
     * aspectRatio 裁剪框宽高比
     * dragMode 拖拽模式，选项为 'crop'（产生一个新的裁剪框） 'move'（移动） 'none'(不处理)
     * cropBoxResizable 是否通过拖动来调整剪裁框的大小
     * zoomable 是否允许放大图片
     * guides 是否显示裁剪框的虚线
     * autoCrop 是否允许初始化自动裁剪
     * zoomOnWheel 是否允许通过鼠标滚轮缩放图片
     * checkCrossOrigin 检查当前图片是否跨域
     * preview 预览的容器 设置了aspectRatio属性，确保将预览容器设置为相同的宽高比
     * crop() 手动显示裁剪框
     * getCroppedCanvas 画一张裁剪的图片
     */
    cropperOptions: Cropper.Options = {
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
            (this.cropperRef as any).cropper.crop();
            return;
        }
    };

    // 图片文件
    imageFile: File | undefined;

    // 图片资源的url
    src: string | undefined;

    saving = false;

    notifyService = inject(ThyNotifyService);

    constructor(public dialog: ThyDialog, private ngZone: NgZone) {}

    ngOnInit(): void {
        if (!this.src) {
            this.setImageSrc();
        }
    }

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
            this.src = (reader.result as ArrayBuffer).toString();
        };
        if (this.imageFile) {
            reader.readAsDataURL(this.imageFile);
        } else {
            this.src = '';
        }
    }

    save() {
        const cropper = (this.cropperRef as ThyCropperComponent).cropper;
        if (cropper) {
            this.saving = true;
            (cropper as Cropper).getCroppedCanvas().toBlob((blob) => {
                const file = new File([blob as Blob], 'avatar.png', { type: 'image/jpeg' });
                if (this.thyUploadAction) {
                    this.thyUploadAction(file)
                        .pipe(
                            finalize(() => {
                                this.saving = false;
                            })
                        )
                        .subscribe(
                            (result) => {
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
        this.ngZone.run(() => {
            this.dialog.close();
        });
    }
}
