import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { InputBoolean } from 'ngx-tethys/core';
import { Route, ThyGlobalStore } from '../../core';
import { menusMap } from '../../utils';
import { ThyProLayoutMenu, ThyProLayoutMenus } from '../layout.entity';

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
        if (this.currentMenuGroup) {
            this.changeMenuGroupCollapsed(this.currentMenuGroup, false);
        }
    }

    @Input() public headerTemplate!: TemplateRef<HTMLElement>;

    @Input() public menuTemplate!: TemplateRef<HTMLElement>;

    @Input() public footerTemplate!: TemplateRef<HTMLElement>;

    public currentMenuGroup!: ThyProLayoutMenu;

    public sidebarCollapsed!: boolean;

    public menuGroupElement!: HTMLElement;

    constructor(public globalStore: ThyGlobalStore) {}

    ngOnInit(): void {
        this.initCurrentMenuGroup();
    }

    getMenuGroupElement(event: MouseEvent) {
        if (this.isCollapsed) {
            this.menuGroupElement = event.target as HTMLElement;
        }
    }

    initCurrentMenuGroup() {
        // 初始化的时候，根据 ThyGlobalStore 的 activeMenu 获取 menuGroup 的路由，设置高亮状态
        const activeRoute = this.globalStore.snapshot.activeMenu;
        const activeRouteWidthParent = menusMap.get(activeRoute?.path as string) as Route & { menuGroup: Route };
        this.currentMenuGroup = activeRouteWidthParent.menuGroup;
    }

    setActiveMenu(menuGroup: ThyProLayoutMenu, activeLinkMenu: Route) {
        this.changeMenuGroupCollapsed(menuGroup, false);
        this.currentMenuGroup = menuGroup;
        this.globalStore.pureUpdateActiveMenu(activeLinkMenu);
    }

    menuGroupCollapsedChange(isCollapsed: boolean, menuGroup: ThyProLayoutMenu) {
        this.changeMenuGroupCollapsed(menuGroup, isCollapsed);
    }

    changeMenuGroupCollapsed(menuGroup: ThyProLayoutMenu, isCollapsed: boolean) {
        menuGroup.isCollapsed = isCollapsed;
    }
}
