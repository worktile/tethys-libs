import { Component, OnInit } from '@angular/core';
import { videoSrc } from '../mock';

@Component({
    selector: 'thy-pro-media-video-example',
    templateUrl: './video.component.html'
})
export class ThyProMediaVideoExampleComponent implements OnInit {
    constructor() {}

    src = videoSrc;

    muted = false;

    autoplay = true;

    controls = true;

    ngOnInit(): void {}
}
