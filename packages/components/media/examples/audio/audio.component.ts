import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'thy-pro-media-audio-example',
    templateUrl: './audio.component.html'
})
export class ThyProMediaAudioExampleComponent implements OnInit {
    constructor(private sanitizer: DomSanitizer) {}

    src: SafeUrl = 'assets/media/audio.mp3';

    errorSrc = 'error.aac';

    autoplay = false;

    ngOnInit(): void {}
}
