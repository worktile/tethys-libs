import { Route as AngularRoute } from '@angular/router';

export interface Route extends AngularRoute {
    children?: Routes;
    data: {
        title?: string; // 菜单名
        icon?: string; // 菜单图标
    };
    path?: string; // 路径
}

export declare type Routes = Route[];
