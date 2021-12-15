import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    host: {
        class: 'app-login-layout'
    }
})
export class LoginComponent implements OnInit {
    saving = false;

    model: {
        name?: string;
        password?: string;
    } = {};

    constructor() {}

    ngOnInit(): void {}

    login() {}
}
