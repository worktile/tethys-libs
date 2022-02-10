import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThyAuthJWTGuard } from '@tethys/auth';
import { BasicLayoutComponent } from './layout/basic/basic.component';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./features/passport/passport.module').then((m) => m.PassportModule)
    },

    {
        path: '',
        component: BasicLayoutComponent,
        children: [
            {
                path: 'dashboard',
                canActivate: [ThyAuthJWTGuard],
                loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'users',
                loadChildren: () => import('./features/user/user.module').then((m) => m.UserModule)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
