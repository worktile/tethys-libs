import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThyAuthService } from '@tethys/auth';

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
        mobile?: string;
        code?: string;
    } = {};

    constructor(public router: Router, protected authService: ThyAuthService) {}

    ngOnInit(): void {}

    login() {
        this.authService
            .authenticate(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            )
            .subscribe(() => {
                this.router.navigateByUrl('/dashboard');
            });
    }
}
