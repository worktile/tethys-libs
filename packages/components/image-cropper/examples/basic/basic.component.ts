import { Component, OnInit } from '@angular/core';
import { ThyDialog } from 'ngx-tethys/dialog';

@Component({
    selector: 'thy-image-cropper-basic-example',
    templateUrl: './basic.component.html'
})
export class ThyImageCropperBasicExampleComponent implements OnInit {
    constructor(public dialog: ThyDialog) {}

    image = 'https://cdn.worktile.com/open-sources/ngx-tethys/logos/tethys.png?100';

    ngOnInit(): void {}
}
