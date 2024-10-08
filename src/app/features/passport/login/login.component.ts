import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ThyAuthService } from '@tethys/auth';
import { ThyGlobalStore } from '@tethys/pro/core';
import { ThyFormDirective, ThyFormValidatorConfig } from 'ngx-tethys/form';
import { ThyStepper } from 'ngx-tethys/stepper';
import { regex } from '../../../constants';

@Component({
    selector: 'app-passport-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    host: {
        class: 'app-passport-login'
    }
})
export class PassportLoginComponent implements OnInit {
    model: {
        account?: string;
        password?: string;
        mobile?: string;
        code?: string;
    } = {};

    cacheAccount!: boolean;

    saving = false;

    mobilePattern = regex.mobile;

    validateConfig: ThyFormValidatorConfig = {
        validationMessages: {
            account: {
                required: '用户名不能为空'
            },
            password: {
                required: '密码不能为空'
            },
            mobile: {
                required: '手机号不能为空',
                pattern: '手机号输入格式不正确'
            },
            code: {
                required: '验证码不能为空'
            }
        }
    };

    @ViewChild('stepper', { static: true }) stepperComponent: ThyStepper = new ThyStepper();

    constructor(
        public router: Router,
        protected authService: ThyAuthService,
        public globalStore: ThyGlobalStore
    ) {}

    ngOnInit(): void {}

    loginByAccount(form: ThyFormDirective) {
        if (this.model.account !== 'admin' && this.model.password !== '123456') {
            form.validator.addError('用户名密码输入错误');
            return;
        }
        this.authService
            .authenticate(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            )
            .subscribe(() => {
                this.router.navigateByUrl('/dashboard');
            });
    }

    loginByMobile(form: ThyFormDirective) {}
}
