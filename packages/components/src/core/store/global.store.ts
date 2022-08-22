import { Injectable } from '@angular/core';
import { Action, Store } from '@tethys/store';
import { GlobalInfo, Route, Routes, SiteSettings } from '../global.entity';

@Injectable({
    providedIn: 'root'
})
export class ThyGlobalStore extends Store<GlobalInfo> {
    constructor() {
        super({});
    }

    @Action()
    initializeConfig(config: SiteSettings) {
        this.setState({ config });
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
    pureUpdateSettings(config: Partial<SiteSettings>) {
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

    // 切换主题
    changeTheme() {}

    // 切换主色
    changePrimaryColor() {}
}
