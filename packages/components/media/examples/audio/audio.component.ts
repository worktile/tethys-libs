import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { audioSrc } from '../mock';

@Component({
    selector: 'thy-pro-media-audio-example',
    templateUrl: './audio.component.html'
})
export class ThyProMediaAudioExampleComponent implements OnInit {
    constructor(private sanitizer: DomSanitizer) {}

    src: SafeUrl = '';

    errorSrc = 'error.aac';

    autoplay = false;

    ngOnInit(): void {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(audioSrc);
    }
}
