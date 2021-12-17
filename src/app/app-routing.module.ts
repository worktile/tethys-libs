import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JWTGuard } from '@tethys/auth';
import { HomeComponent } from './layout/home/home.component';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./features/passport/passport.module').then((m) => m.PassportModule)
    },

    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'dashboard',
                canActivate: [JWTGuard],
                loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule)
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
