import { Inject, Injectable } from '@angular/core';
import { Action, Store } from '@tethys/store';
import { Route, Routes, ThyGlobalInfo, ThySiteSettings } from '../global.entity';
import { THY_SITE_SETTINGS } from '../settings.config';

@Injectable({
    providedIn: 'root'
})
export class ThyGlobalStore extends Store<ThyGlobalInfo> {
    constructor(@Inject(THY_SITE_SETTINGS) public config: ThySiteSettings) {
        super({});
    }

    @Action()
    initializeMenus(menus: Routes) {
        this.update({ menus });
    }

    @Action()
    pureUpdateActiveMenu(menu: Route) {
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
