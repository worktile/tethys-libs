import { Route as AngularRoute } from '@angular/router';
import { ThyMenuRoute } from './menu';

type Theme = 'light' | 'dark' | 'auto';

type Layout = 'side' | 'top' | 'mix';

export interface ThySiteSettings {
    theme: Theme; // 整体风格
    primaryColor: string; // 主题色
    layout: Layout; // layout 的菜单模式, side：右侧导航，top：顶部导航，mix： 混合
    showHeader: boolean; // 是否展示 Header
    showFooter: boolean; // 是否展示 Footer
    fixSiderbar: boolean; // 是否固定侧边菜单
    fixedHeader: boolean; // 是否固定 Header
    splitMenu: boolean; // 是否分割菜单（mix 模式下生效）
}

export interface ThyGlobalInfo {
    settings: ThySiteSettings;
    menus: ThyMenuRoute[];
    activeMenu?: ThyMenuRoute;
}
