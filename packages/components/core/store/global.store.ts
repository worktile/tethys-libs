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
export class ThyGlobalStore extends Store<ThyGlobalInfo> {
    private menuCustomLoadStrategy = inject(THY_MENU_LOAD_STRATEGY, { optional: true });
    private menuDefaultLoadStrategy = inject(ThyMenuLoadDefaultStrategy);

    private get menuLoadStrategy() {
        return this.menuCustomLoadStrategy || this.menuDefaultLoadStrategy;
    }

    public config: ThySiteSettings = inject(THY_SITE_SETTINGS);

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
        this.update({ menus });
    }

    @Action()
    pureUpdateActiveMenuByRoute(route: Route | undefined | null) {
        if (route) {
            const menu = this.menuLoadStrategy.getMenuByRoute(route);
            this.update({ activeMenu: menu });
        }
    }

    @Action()
    pureUpdateActiveMenu(menu: ThyMenuRoute) {
        this.update({ activeMenu: menu });
    }

    @Action()
    pureUpdateSettings(config: Partial<ThySiteSettings>) {
        this.update({
            config: {
                ...this.snapshot.config,
                ...config
            }
        });
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
