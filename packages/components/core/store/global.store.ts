import { inject, Inject, Injectable } from '@angular/core';
import { Action, Store } from '@tethys/store';
import { ThyGlobalInfo, ThySiteSettings } from '../global.entity';
import { THY_SITE_SETTINGS } from '../settings.config';
import { THY_MENU_LOAD_STRATEGY, ThyMenuRoute } from '../menu';
import { ThyMenuLoadDefaultStrategy } from '../menu-load-default-strategy';
import { Route } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ThyGlobalStore<T extends ThyGlobalInfo = ThyGlobalInfo> extends Store<T> {
    private menuCustomLoadStrategy = inject(THY_MENU_LOAD_STRATEGY, { optional: true });
    private menuDefaultLoadStrategy = inject(ThyMenuLoadDefaultStrategy);

    private get menuLoadStrategy() {
        return this.menuCustomLoadStrategy || this.menuDefaultLoadStrategy;
    }

    constructor() {
        super({});
    }

    @Action()
    initialize() {
        this.menuLoadStrategy.load().subscribe((menus) => {
            this.initializeMenus(menus);
        });
    }

    @Action()
    initializeMenus(menus: ThyMenuRoute[]) {
        this.update((state) => {
            return {
                ...state,
                menus
            };
        });
    }

    @Action()
    pureUpdateActiveMenuByRoute(route: Route | undefined | null) {
        if (route) {
            const menu = this.menuLoadStrategy.getMenuByRoute(route);
            this.update({ activeMenu: menu } as Partial<T>);
        }
    }

    @Action()
    pureUpdateActiveMenu(menu: ThyMenuRoute) {
        this.update({ activeMenu: menu } as Partial<T>);
    }

    @Action()
    pureUpdateSettings(config: Partial<ThySiteSettings>) {
        this.update({
            settings: {
                ...this.snapshot.settings,
                ...config
            }
        } as Partial<T>);
        for (const key in config) {
            if (key === 'layout') {
                this.changeTheme();
            }
            if (key === 'primaryColor') {
                this.changePrimaryColor();
            }
        }
    }

    // 切换主题
    changeTheme() {}

    // 切换主色
    changePrimaryColor() {}
}
