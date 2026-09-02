import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-passport-layout',
    templateUrl: './passport.component.html',
    styleUrls: ['./passport.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PassportLayoutComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
