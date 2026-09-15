import { Component, OnInit } from '@angular/core';
import { ThyDialog } from 'ngx-tethys/dialog';

@Component({
    selector: 'thy-image-cropper-basic-example',
    templateUrl: './basic.component.html',
    standalone: false
})
export class ThyImageCropperBasicExampleComponent implements OnInit {
    constructor(public dialog: ThyDialog) {}

    image = 'https://cdn-tc.worktile.com/open-sources/ngx-tethys/logos/tethys.png';

    ngOnInit(): void {}
}
