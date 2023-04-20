import { Component, OnInit } from '@angular/core';
import { ThyImageCropperDialogComponent } from '@tethys/pro/image-cropper';
import { ThyDialog, ThyDialogSizes } from 'ngx-tethys/dialog';
import { of } from 'rxjs';

@Component({
    selector: 'thy-open-with-dialog-example',
    templateUrl: './open-with-dialog.component.html'
})
export class ThyOpenWithDialogExampleComponent implements OnInit {
    constructor(public dialog: ThyDialog) {}

    image = 'https://cdn.worktile.com/open-sources/ngx-tethys/logos/tethys.png?100';

    ngOnInit(): void {}

    selectImage(image: { files: FileList[] }) {
        if (image.files.length > 0) {
            this.dialog.open(ThyImageCropperDialogComponent, {
                size: ThyDialogSizes.md,
                initialState: {
                    image: image.files[0],
                    shape: 'round',
                    uploadSizeThreshold: 1024 * 2,
                    previewSizes: [
                        { width: 120, height: '120px' },
                        { width: 36, height: '36px' }
                    ]
                }
            });
        }
    }

    previewImage() {
        this.dialog.open(ThyImageCropperDialogComponent, {
            size: ThyDialogSizes.md,
            initialState: {
                image: this.image,
                uploadTips: '最佳尺寸 320 X 120 像素',
                previewSizes: [
                    { width: 160, height: '60px' },
                    { width: 80, height: '30px' }
                ],
                confirmAction: this.confirmAction,
                viewMode: 1,
                aspectRatio: 320 / 120
            }
        });
    }

    confirmAction = (file: File) => {
        return of(true);
    };
}
