import { ChangeDetectionStrategy, Component, Input, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { InputBoolean } from 'ngx-tethys/core';
import { ThyGlobalStore, ThyMenuRoute } from '@tethys/pro/core';
import { ThyProLayoutMenu, ThyProLayoutMenus } from '../layout.entity';
import { ThyPopoverConfig, ThyPopoverDirective, ThyPopoverModule } from 'ngx-tethys/popover';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { SafeAny } from 'ngx-tethys/types';

@Component({
    selector: 'thy-pro-sidebar',
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-layout thy-pro-sidebar'
    },
    standalone: true,
    imports: [ThyLayoutModule, NgClass, NgTemplateOutlet, ThyMenuModule, ThyPopoverModule, RouterLinkActive, RouterLink]
})
export class ThyProSidebarComponent implements OnInit {
    @Input() menus!: ThyProLayoutMenus;

    @Input() logo!: string;

    @Input() title!: string;

    @Input() @InputBoolean() set isCollapsed(value: boolean) {
        this.sidebarCollapsed = value;
        if (this.currentRootMenuGroup) {
            this.changeMenuGroupCollapsed(this.currentRootMenuGroup, false);
        }
    }

    @Input() public headerTemplate!: TemplateRef<SafeAny>;

    @Input() public menuTemplate!: TemplateRef<SafeAny>;

    @Input() public footerTemplate!: TemplateRef<SafeAny>;

    public currentRootMenuGroup!: ThyProLayoutMenu;

    public sidebarCollapsed!: boolean;

    public menuGroupElement!: HTMLElement;

    @ViewChildren(ThyPopoverDirective) menuPopovers!: QueryList<ThyPopoverDirective>;

    activeMenu = this.globalStore.select((state) => state.activeMenu);

    constructor(public globalStore: ThyGlobalStore) {}

    ngOnInit(): void {
        this.initCurrentMenuGroup();
    }

    getMenuGroupElement(event: MouseEvent) {
        if (this.isCollapsed) {
            this.menuGroupElement = event.target as HTMLElement;
        }
    }

    initCurrentMenuGroup() {}

    setActiveMenu(menuGroup: ThyProLayoutMenu, activeLinkMenu: ThyMenuRoute) {
        this.menuPopovers?.forEach((item) => {
            item.popoverOpened && item.hide();
        });
        this.changeMenuGroupCollapsed(menuGroup, false);
        this.globalStore.pureUpdateActiveMenu(activeLinkMenu);
    }

    menuGroupCollapsedChange(isCollapsed: boolean, menuGroup: ThyProLayoutMenu) {
        this.changeMenuGroupCollapsed(menuGroup, isCollapsed);
    }

    changeMenuGroupCollapsed(menuGroup: ThyProLayoutMenu, isCollapsed: boolean) {
        menuGroup.isCollapsed = isCollapsed;
    }
}
