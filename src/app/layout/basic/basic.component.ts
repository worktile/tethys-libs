import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    host: {
        class: 'thy-layout'
    }
})
export class BasicLayoutComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
