import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    host: {
        class: 'thy-layout'
    }
})
export class HomeComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
