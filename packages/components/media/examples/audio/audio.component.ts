import { Component, OnInit } from '@angular/core';
import { audioSrc } from '../mock';

@Component({
    selector: 'thy-pro-media-audip-example',
    templateUrl: './audio.component.html'
})
export class ThyProMediaAudioExampleComponent implements OnInit {
    constructor() {}

    src = audioSrc;

    errorSrc = 'error.aac';

    autoplay = false;

    ngOnInit(): void {}
}
