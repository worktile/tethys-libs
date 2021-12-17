import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService, AUTH_SERVICE_TOKEN } from '@tethys/auth';

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

    constructor(public router: Router, @Inject(AUTH_SERVICE_TOKEN) private tokenService: AuthTokenService) {}

    ngOnInit(): void {}

    login() {
        this.tokenService.set({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            expired: 6000
        });
        this.router.navigateByUrl('/dashboard');
    }
}
