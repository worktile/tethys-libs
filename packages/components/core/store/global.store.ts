import { Inject, Injectable } from '@angular/core';
import { cache } from '@tethys/cache';
import { Action, Store } from '@tethys/store';
import { SafeAny } from 'ngx-tethys/types';
import { Route, Routes, ThyGlobalInfo, ThyMemberInfo, ThySiteSettings } from '../global.entity';
import { THY_SITE_SETTINGS } from '../settins.config';

@Injectable({
    providedIn: 'root'
})
export class ThyGlobalStore extends Store<ThyGlobalInfo> {
    private _user: ThyMemberInfo | null = null;

    constructor(@Inject(THY_SITE_SETTINGS) public config: ThySiteSettings) {
        super({});
    }

    @Action()
    initializeMenus(menus: Routes) {
        this.setState({ menus });
    }

    @Action()
    pureUpdateActiveMenu(menu: Route) {
        this.setState({ activeMenu: menu });
    }

    @Action()
    pureUpdateSettings(config: Partial<ThySiteSettings>) {
        this.setState({
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

    getData(key: string): SafeAny {
        return cache.get(key) || null;
    }

    setData(key: string, value: SafeAny): void {
        cache.set(key, value);
    }

    // 切换主题
    changeTheme() {}

    // 切换主色
    changePrimaryColor() {}
}
