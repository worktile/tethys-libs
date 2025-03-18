import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'thy-pro-media-audio-example',
    templateUrl: './audio.component.html',
    standalone: false
})
export class ThyProMediaAudioExampleComponent implements OnInit {
    constructor(private sanitizer: DomSanitizer) {}

    src: SafeUrl = 'assets/media/audio.mp3';

    errorSrc = 'error.aac';

    autoplay = false;

    fileName = 'audio.mp3';

    size = '1.7 MB';

    ngOnInit(): void {}
}
