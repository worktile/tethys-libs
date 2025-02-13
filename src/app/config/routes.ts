import { Routes, ɵEmptyOutletComponent as EmptyOutletComponent } from '@angular/router';
import { ThyAuthJWTGuard } from '@tethys/auth';
import { ThyLayoutEmptyRouterOutlet } from '@tethys/pro/layout';
import { WorkplaceComponent } from '../features/dashboard/workplace/workplace.component';
import { UserListComponent } from '../features/user/list/list.component';
import { BasicLayoutComponent } from '../layout/basic/basic.component';
import { InsightComponent } from '../features/dashboard/insight/insight.component';
import { AppTodosComponent } from '../features/todo/todos.component';
import { AppTodoComponent } from '../features/todo/todo/todo.component';
import { TodosStore } from '../features/todo/todos.store';

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
                path: '',
                data: {
                    title: '列表',
                    icon: 'list'
                },
                children: [
                    {
                        path: '',
                        redirectTo: 'users',
                        pathMatch: 'full'
                    },
                    {
                        path: 'users',
                        data: {
                            title: '用户管理'
                        },
                        component: UserListComponent
                    },
                    {
                        path: 'todos',
                        data: {
                            title: '待办列表'
                        },
                        component: ThyLayoutEmptyRouterOutlet,
                        providers: [TodosStore],
                        children: [
                            {
                                path: '',
                                component: AppTodosComponent
                            },
                            {
                                path: ':id',
                                component: AppTodoComponent
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
