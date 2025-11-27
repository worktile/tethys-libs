import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, TemplateRef, viewChildren } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThyGlobalStore, ThyMenuRoute } from '@tethys/pro/core';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyPopoverDirective, ThyPopoverModule } from 'ngx-tethys/popover';
import { SafeAny } from 'ngx-tethys/types';
import { ThyProLayoutMenu, ThyProLayoutMenus } from '../layout.entity';

@Component({
    selector: 'thy-pro-sidebar',
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-layout thy-pro-sidebar'
    },
    imports: [ThyLayoutModule, NgClass, NgTemplateOutlet, ThyMenuModule, ThyPopoverModule, RouterLinkActive, RouterLink]
})
export class ThyProSidebarComponent implements OnInit {
    readonly menus = input.required<ThyProLayoutMenus>();

    readonly logo = input.required<string>();

    readonly title = input.required<string>();

    readonly isCollapsed = input<boolean>(false);

    public readonly headerTemplate = input<TemplateRef<SafeAny>>();

    public readonly menuTemplate = input<TemplateRef<SafeAny>>();

    public readonly footerTemplate = input<TemplateRef<SafeAny>>();

    public currentRootMenuGroup!: ThyProLayoutMenu;

    public menuGroupElement!: HTMLElement;

    readonly menuPopovers = viewChildren(ThyPopoverDirective);

    protected globalStore = inject(ThyGlobalStore);

    activeMenu = this.globalStore.select((state) => state.activeMenu);

    constructor() {
        effect(() => {
            if (this.currentRootMenuGroup) {
                this.changeMenuGroupCollapsed(this.currentRootMenuGroup, false);
            }
        });
    }

    ngOnInit(): void {
        this.initCurrentMenuGroup();
    }

    getMenuGroupElement(event: MouseEvent) {
        if (this.isCollapsed()) {
            this.menuGroupElement = event.target as HTMLElement;
        }
    }

    initCurrentMenuGroup() {}

    setActiveMenu(menuGroup: ThyProLayoutMenu, activeLinkMenu: ThyMenuRoute) {
        this.menuPopovers()?.forEach((item) => {
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
