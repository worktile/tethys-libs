import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InputBoolean } from 'ngx-tethys/core';
import { ThyMenuGroupComponent } from 'ngx-tethys/menu';
import { Route, ThyGlobalStore } from '../../core';
import { menusMap } from '../../utils';
import { ThyProLayoutMenu, ThyProLayoutMenus } from '../layout.entity';
import { SafeAny } from 'ngx-tethys/types';

@Component({
    selector: 'thy-pro-sidebar',
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-layout thy-pro-sidebar'
    }
})
export class ThyProSidebarComponent implements OnInit {
    @Input() menus!: ThyProLayoutMenus;

    @Input() logo!: string;

    @Input() title!: string;

    @Input() @InputBoolean() set isCollapsed(value: boolean) {
        this.sidebarCollapsed = value;
        if (this.currentGroupMenu) {
            this.currentGroupMenu.isCollapsed = value;
        }
    }

    @Input() public headerTemplate!: TemplateRef<HTMLElement>;

    @Input() public menuTemplate!: TemplateRef<HTMLElement>;

    @Input() public footerTemplate!: TemplateRef<HTMLElement>;

    public currentGroupMenu!: ThyProLayoutMenu;

    public sidebarCollapsed!: boolean;

    @ViewChild('menuGroup') menuGroupElement!: ElementRef<SafeAny>;

    constructor(public globalStore: ThyGlobalStore) {}

    ngOnInit(): void {
        this.initCurrentGroupMenu();
    }

    initCurrentGroupMenu() {
        // 初始化的时候，根据 ThyGlobalStore 的 activeMenu 获取 menuGroup 的路由，设置高亮状态
        const activeRoute = this.globalStore.snapshot.activeMenu;
        const activeRouteWidthParent = menusMap.get(activeRoute?.path as string) as Route & { groupMenu: Route };
        this.currentGroupMenu = activeRouteWidthParent.groupMenu;
    }

    setActiveMenu(groupMenu: ThyProLayoutMenu, activeLinkMenu: Route) {
        groupMenu.isCollapsed = false;
        this.currentGroupMenu = groupMenu;
        this.globalStore.pureUpdateActiveMenu(activeLinkMenu);
    }

    menuGroupCollapsedChange(isCollapsed: boolean, groupMenu: ThyProLayoutMenu) {
        groupMenu.isCollapsed = isCollapsed;
    }
}
