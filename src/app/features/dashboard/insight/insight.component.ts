import { Component, OnInit } from '@angular/core';
import { ThyLayoutDirective, ThyLayoutModule } from 'ngx-tethys/layout';

@Component({
    selector: 'app-insight',
    templateUrl: './insight.component.html',
    styleUrls: ['./insight.component.scss'],
    imports: [ThyLayoutModule],
    hostDirectives: [ThyLayoutDirective]
})
export class InsightComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
