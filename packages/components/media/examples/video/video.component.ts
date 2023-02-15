import { Component, OnInit } from '@angular/core';
import { videoSrc, videoSrc1 } from '../mock';

@Component({
    selector: 'thy-pro-media-video-example',
    templateUrl: './video.component.html'
})
export class ThyProMediaVideoExampleComponent implements OnInit {
    constructor() {}

    // src = 'blob:https://czzy01.com/6a0a6888-1421-42ec-be38-22308fc2eb31';
    src = videoSrc;

    errorSrc = 'error.aac';

    errorSrc1 = videoSrc1;

    autoplay = false;

    ngOnInit(): void {}
}
