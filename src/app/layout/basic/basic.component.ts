import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThyTokenService } from '@tethys/auth';
import { ThyGlobalStore } from '@tethys/pro/core';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    host: {
        class: 'thy-layout'
    },
    standalone: false
})
export class BasicLayoutComponent implements OnInit {
    constructor(
        public globalStore: ThyGlobalStore,
        protected tokenService: ThyTokenService,
        private router: Router
    ) {}

    ngOnInit(): void {}

    onLogout() {
        this.tokenService.clear();
        this.router.navigateByUrl('/passport/logout');
    }
}
