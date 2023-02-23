import { Component, OnInit } from '@angular/core';
import { ThyProCropperPreviewComponent } from '@tethys/pro/cropper';
import { ThyDialog, ThyDialogSizes } from 'ngx-tethys/dialog';
import { of } from 'rxjs';

@Component({
    selector: 'thy-pro-cropper-basic-example',
    templateUrl: './basic.component.html'
})
export class ThyProCropperBasicExampleComponent implements OnInit {
    constructor(public dialog: ThyDialog) {}

    src = 'https://cdn.worktile.com/open-sources/ngx-tethys/logos/tethys.png?100';

    ngOnInit(): void {}

    selectImage(image: { files: FileList[] }) {
        if (image.files.length > 0) {
            this.dialog.open(ThyProCropperPreviewComponent, {
                size: ThyDialogSizes.lg,
                initialState: {
                    imageFile: image.files[0]
                }
            });
        }
    }

    previewImage() {
        this.dialog.open(ThyProCropperPreviewComponent, {
            size: ThyDialogSizes.lg,
            initialState: {
                thySrc: this.src,
                thyUploadAction: this.uploadAction
            }
        });
    }

    uploadAction = (file: File) => {
        return of(true);
    };
}
