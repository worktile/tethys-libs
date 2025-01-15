import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThyLayoutModule, ThyLayoutDirective } from 'ngx-tethys/layout';

@Component({
    selector: 'app-insight',
    templateUrl: './insight.component.html',
    styleUrls: ['./insight.component.scss'],
    standalone: true,
    imports: [ThyLayoutModule, RouterOutlet],
    hostDirectives: [ThyLayoutDirective]
})
export class InsightComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
