import { Component, OnInit } from '@angular/core';
import { ThyDialog } from 'ngx-tethys/dialog';

@Component({
    selector: 'thy-image-cropper-round-example',
    templateUrl: './round.component.html',
    standalone: false
})
export class ThyImageCropperRoundExampleComponent implements OnInit {
    constructor(public dialog: ThyDialog) {}

    image = 'https://cdn.worktile.com/open-sources/ngx-tethys/logos/tethys.png?100';

    ngOnInit(): void {}
}
