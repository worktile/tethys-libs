import { Component, OnInit } from '@angular/core';
import { videoSrc } from '../mock';

@Component({
    selector: 'thy-pro-media-video-example',
    templateUrl: './video.component.html'
})
export class ThyProMediaVideoExampleComponent implements OnInit {
    constructor() {}

    src = videoSrc;

    errorSrc = 'error.mp4';

    autoplay = true;

    ngOnInit(): void {}
}
