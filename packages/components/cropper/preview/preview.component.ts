import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ThyCropperComponent } from '@tethys/pro/cropper';
import { ThyDialog } from 'ngx-tethys/dialog';
import { finalize, Observable } from 'rxjs';

@Component({
    selector: 'thy-cropper-preview',
    templateUrl: './preview.component.html'
})
export class ThyProCropperPreviewComponent implements OnInit {
    @HostBinding('class') className = 'thy-dialog-content thy-cropper-preview';

    /**
     * 上传图标回调方法
     */
    @Input() thyUploadAction: ((file: File) => Observable<any>) | undefined;

    /**
     * 标题
     */
    @Input() thyTitle: string = '上传头像';

    /**
     * 图片资源的url
     */
    @Input() set thySrc(src: string) {
        this.src = src;
    }

    @ViewChild('cropper', { static: true }) cropperRef: ThyCropperComponent | undefined;

    @ViewChild('defaultAvatar', { static: true }) defaultAvatar: ElementRef | undefined;

    @ViewChild('smAvatar', { static: true }) smAvatar: ElementRef | undefined;

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
        preview: '.preview-avatar-warp',
        ready: (event) => {
            (this.cropperRef as any).cropper.crop();
            return;
        },
        crop: (event) => {
            return;
        }
    };

    avatarFile: File | undefined;

    src: string | undefined;

    saving = false;

    constructor(public dialog: ThyDialog) {}

    ngOnInit(): void {}

    thyImageCropperChange(value: any) {
        console.log(value, 'cropperChange1');
    }

    selectAvatar(avatar: { files: File[] }) {
        if (avatar.files.length > 0) {
            this.avatarFile = avatar.files[0];
            this.setImageSrc();
        }
    }

    setImageSrc() {
        const reader = new FileReader();
        reader.onloadend = () => {
            const cropperRef = (this.cropperRef as ThyCropperComponent).cropper;
            if (cropperRef) {
                cropperRef.destroy();
                cropperRef.replace((reader.result as ArrayBuffer).toString(), true);
                cropperRef.reset();
            }
            this.src = (reader.result as ArrayBuffer).toString();
        };
        if (this.avatarFile) {
            reader.readAsDataURL(this.avatarFile);
        } else {
            this.src = '';
        }
    }

    save() {
        const cropper = (this.cropperRef as ThyCropperComponent).cropper;
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
                            // this.notify.error(error);
                        }
                    );
            } else {
                this.saving = false;
            }
        });
    }

    close() {
        this.dialog.close();
    }
}
