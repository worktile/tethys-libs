import { Component, OnInit } from '@angular/core';
import { ThyProCropperPreviewComponent } from '@tethys/pro/cropper';
import { ThyDialog } from 'ngx-tethys/dialog';

@Component({
    selector: 'thy-pro-cropper-basic-example',
    templateUrl: './basic.component.html'
})
export class ThyProCropperBasicExampleComponent implements OnInit {
    constructor(public dialog: ThyDialog) {}

    src = 'https://cdn.worktile.com/open-sources/ngx-tethys/logos/tethys.png?100';

    ngOnInit(): void {}

    uploadImage() {}

    previewImage() {
        this.dialog.open(ThyProCropperPreviewComponent, {
            initialState: {
                thySrc: this.src
            }
        });
    }
}
