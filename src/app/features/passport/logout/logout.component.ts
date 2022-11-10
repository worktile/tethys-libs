import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-passport-logout',
    templateUrl: './logout.component.html',
    host: {
        class: 'app-passport-logout'
    }
})
export class PassportLogoutComponent implements OnInit {
    constructor(public router: Router) {}

    ngOnInit(): void {}

    toLogin() {
        this.router.navigateByUrl('/passport/login');
    }
}
