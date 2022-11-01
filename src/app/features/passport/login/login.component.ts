import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ThyAuthService } from '@tethys/auth';
import { ThyGlobalStore } from '@tethys/pro';
import { ThyFormDirective, ThyFormValidatorConfig } from 'ngx-tethys/form';
import { ThyStepperComponent } from 'ngx-tethys/stepper';
import { of } from 'rxjs';

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
        rememberAccount?: boolean;
        forgot?: string;
    } = {
        rememberAccount: false
    };

    mobilePattern = /^1([3-9])\d{9}$/;

    validateConfig: ThyFormValidatorConfig = {
        validationMessages: {
            username: {
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

    @ViewChild('stepper', { static: true }) stepperComponent: ThyStepperComponent = new ThyStepperComponent();

    constructor(public router: Router, protected authService: ThyAuthService, public globalStore: ThyGlobalStore) {}

    ngOnInit(): void {}

    sendAction() {
        return of(true);
    }

    login(form: ThyFormDirective) {
        if (this.stepperComponent.selectedIndex === 0 && (this.model.name !== 'admin' || this.model.password !== 'admin')) {
            form.validator.addError('帐号密码输入错误(admin/admin)');
            return;
        }
        this.globalStore.setUser({ uid: 'admin', name: 'admin' });
        this.authService
            .authenticate(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            )
            .subscribe(() => {
                this.router.navigateByUrl('/dashboard');
            });
    }
}
