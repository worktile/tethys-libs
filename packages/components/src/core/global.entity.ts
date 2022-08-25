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

export type ThyTheme = 'light' | 'dark' | 'auto';

export type ThyLayout = 'side' | 'top' | 'mix';

export interface ThySiteSettings {
    theme: ThyTheme; // 整体风格
    primaryColor: string; // 主题色
    layout: ThyLayout; // layout 的菜单模式, side：右侧导航，top：顶部导航，mix： 混合
    showHeader: boolean; // 是否展示 Header
    showFooter: boolean; // 是否展示 Footer
    fixSiderbar: boolean; // 是否固定侧边菜单
    fixedHeader: boolean; // 是否固定 Header
    splitMenu: boolean; // 是否分割菜单（mix 模式下生效）
}

export interface ThyGlobalInfo {
    config: ThySiteSettings;
    menus: Routes;
    activeMenu?: Route;
}
