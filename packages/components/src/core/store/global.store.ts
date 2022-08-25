import { Inject, Injectable } from '@angular/core';
import { Action, Store } from '@tethys/store';
import { ThyGlobalInfo, Route, Routes, ThySiteSettings } from '../global.entity';
import { THY_SITE_SETTINGS } from '../settins.config';

@Injectable({
    providedIn: 'root'
})
export class ThyGlobalStore extends Store<ThyGlobalInfo> {
    constructor(@Inject(THY_SITE_SETTINGS) public config: ThySiteSettings) {
        super({});
        this.setState({
            config: this.config
        });
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
                this.changeLayout();
            }
            if (key === 'primaryColor') {
                this.changePrimaryColor();
            }
        }
    }

    // 切换布局
    changeLayout() {}

    // 切换主色
    changePrimaryColor() {}
}
