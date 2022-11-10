import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassportLayoutComponent } from '../../layout/passport/passport.component';
import { PassportLoginComponent } from './login/login.component';
import { PassportLogoutComponent } from './logout/logout.component';

const routes: Routes = [
    {
        path: '',
        component: PassportLayoutComponent,
        children: [
            {
                path: 'login',
                component: PassportLoginComponent
            },
            {
                path: 'logout',
                component: PassportLogoutComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PassportRoutingModule {}
