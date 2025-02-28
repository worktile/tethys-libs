import { Component, OnInit } from '@angular/core';
import { ThyProLayoutModule } from '@tethys/pro/layout';
import { ThyInputSearch } from 'ngx-tethys/input';
import { ThySpace, ThySpaceItemDirective } from 'ngx-tethys/space';
import { ThyButton } from 'ngx-tethys/button';

@Component({
    selector: 'thy-pro-layout-content-main-example',
    templateUrl: './content-main.component.html',
    styleUrls: ['./content-main.component.scss'],
    standalone: true,
    imports: [ThyProLayoutModule, ThyInputSearch, ThySpace, ThySpaceItemDirective, ThyButton]
})
export class ThyProLayoutContentMainExampleComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
