import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'thy-pro-media-video-example',
    templateUrl: './video.component.html',
    standalone: false
})
export class ThyProMediaVideoExampleComponent implements OnInit {
    constructor() {}

    src = 'assets/media/video.mp4';

    errorSrc = 'error.aac';

    errorSrc1 = 'assets/media/audio.mp3';

    autoplay = false;

    ngOnInit(): void {}
}
