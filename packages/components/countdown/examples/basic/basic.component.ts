import { Component, OnInit } from '@angular/core';
import { delay, of } from 'rxjs';

@Component({
    selector: 'thy-pro-layout-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    standalone: false
})
export class ThyProCountdownBasicExampleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    sendAction = () => {
        return of(false).pipe(delay(30000));
    };
}
