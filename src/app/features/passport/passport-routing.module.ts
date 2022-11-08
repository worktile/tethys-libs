import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassportLayoutComponent } from '../../layout/passport/passport.component';
import { PassportLoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: '',
        component: PassportLayoutComponent,
        children: [
            {
                path: '',
                component: PassportLoginComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PassportRoutingModule {}
