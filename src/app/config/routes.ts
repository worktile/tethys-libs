import { Routes } from '@angular/router';
import { ThyAuthJWTGuard } from '@tethys/auth';
import { WorkplaceComponent } from '../features/dashboard/workplace/workplace.component';
import { UserListComponent } from '../features/user/list/list.component';
import { BasicLayoutComponent } from '../layout/basic/basic.component';

export const ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: () => import('../features/passport/passport.module').then((m) => m.PassportModule)
    },
    {
        path: '',
        component: BasicLayoutComponent,
        children: [
            {
                path: 'dashboard',
                canActivate: [ThyAuthJWTGuard],
                data: {
                    title: '工作台',
                    icon: 'dashboard'
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'basic',
                        pathMatch: 'full'
                    },
                    {
                        path: 'basic',
                        component: WorkplaceComponent,
                        data: {
                            title: '仪表盘'
                        }
                    },
                    {
                        path: 'list',
                        data: {
                            title: '统计报表'
                        },
                        component: WorkplaceComponent
                    }
                ]
                // loadChildren: () => import('../features/dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'users',
                data: {
                    title: '列表',
                    icon: 'list'
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'manage',
                        pathMatch: 'full'
                    },
                    {
                        path: 'manage',
                        data: {
                            title: '用户管理'
                        },
                        component: UserListComponent
                    }
                ]
                // loadChildren: () => import('../features/user/user.module').then((m) => m.UserModule)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
