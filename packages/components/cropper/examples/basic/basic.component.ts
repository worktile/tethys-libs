import { Component, OnInit } from '@angular/core';
import { ThyCropperDialogComponent } from '@tethys/pro/cropper';
import { ThyDialog, ThyDialogSizes } from 'ngx-tethys/dialog';
import { of } from 'rxjs';

@Component({
    selector: 'thy-pro-cropper-basic-example',
    templateUrl: './basic.component.html'
})
export class ThyProCropperBasicExampleComponent implements OnInit {
    constructor(public dialog: ThyDialog) {}

    image = 'https://cdn.worktile.com/open-sources/ngx-tethys/logos/tethys.png?100';

    ngOnInit(): void {}

    selectImage(image: { files: FileList[] }) {
        if (image.files.length > 0) {
            this.dialog.open(ThyCropperDialogComponent, {
                size: ThyDialogSizes.lg,
                initialState: {
                    image: image.files[0]
                }
            });
        }
    }

    previewImage() {
        this.dialog.open(ThyCropperDialogComponent, {
            size: ThyDialogSizes.lg,
            initialState: {
                image: this.image,
                previewSizes: [
                    { width: 120, height: '120px' },
                    { width: 38, height: '38px' }
                ],
                thyUploadAction: this.uploadAction
            }
        });
    }

    uploadAction = (file: File) => {
        return of(true);
    };
}
