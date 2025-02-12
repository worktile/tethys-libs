import { Routes } from '@angular/router';
import { ThyAuthJWTGuard } from '@tethys/auth';
import { WorkplaceComponent } from '../features/dashboard/workplace/workplace.component';
import { UserListComponent } from '../features/user/list/list.component';
import { BasicLayoutComponent } from '../layout/basic/basic.component';
import { InsightComponent } from '../features/dashboard/insight/insight.component';
import { AppTodosComponent } from '../features/todos/todos.component';

export const ROUTES: Routes = [
    {
        path: 'passport',
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
                        component: InsightComponent
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
                    },
                    {
                        path: 'search',
                        data: {
                            title: '搜索列表'
                        },
                        component: AppTodosComponent,
                        children: [
                            {
                                path: 'articles',
                                data: {
                                    title: '搜索文章'
                                },
                                component: AppTodosComponent
                            }
                        ]
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
