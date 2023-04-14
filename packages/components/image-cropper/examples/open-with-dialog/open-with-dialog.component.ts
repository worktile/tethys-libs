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
                size: ThyDialogSizes.lg,
                initialState: {
                    image: image.files[0],
                    cropperShape: 'round',
                    uploadSizeThreshold: 1024 * 2
                }
            });
        }
    }

    previewImage() {
        this.dialog.open(ThyImageCropperDialogComponent, {
            size: ThyDialogSizes.lg,
            initialState: {
                image: this.image,
                previewSizes: [
                    { width: 120, height: '120px' },
                    { width: 38, height: '38px' }
                ],
                confirmAction: this.confirmAction,
                cropperViewMode: 1,
                cropperAspectRatio: 2
            }
        });
    }

    confirmAction = (file: File) => {
        return of(true);
    };
}
