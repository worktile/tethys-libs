import { Component, OnInit } from '@angular/core';
import { ThyCard, ThyCardHeader, ThyCardContent } from 'ngx-tethys/card';
import { ThyFlex, ThyFlexItem } from 'ngx-tethys/grid';
import { ThyContentDirective } from 'ngx-tethys/layout';

@Component({
    selector: 'app-workplace',
    templateUrl: './workplace.component.html',
    styleUrls: ['./workplace.component.scss'],
    standalone: true,
    imports: [ThyCard, ThyCardHeader, ThyCardContent, ThyFlex, ThyFlexItem],
    hostDirectives: [ThyContentDirective]
})
export class WorkplaceComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
