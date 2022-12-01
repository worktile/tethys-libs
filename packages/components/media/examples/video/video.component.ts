import { Component, OnInit } from '@angular/core';
import { videoSrc, videoSrc1 } from '../mock';

@Component({
    selector: 'thy-pro-media-video-example',
    templateUrl: './video.component.html'
})
export class ThyProMediaVideoExampleComponent implements OnInit {
    constructor() {}

    src = videoSrc;

    errorSrc = 'error.aac';

    errorSrc1 = videoSrc1;

    autoplay = true;

    ngOnInit(): void {}
}
