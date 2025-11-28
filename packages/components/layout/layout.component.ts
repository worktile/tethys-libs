import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, contentChild, input, model, output } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { cache } from '@tethys/cache';
import { ThyGlobalStore, ThyMenuRoute } from '@tethys/pro/core';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { SafeAny } from 'ngx-tethys/types';
import { ThyProHeaderComponent } from './header/header.component';
import { ThyProSidebarComponent } from './sidebar/sidebar.component';

@Component({
    selector: 'thy-pro-layout',
    templateUrl: './layout.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-layout thy-layout--has-sidebar thy-pro-layout'
    },
    imports: [ThyLayoutModule, ThyProSidebarComponent, ThyProHeaderComponent, RouterOutlet, NgTemplateOutlet]
})
export class ThyProLayoutComponent implements OnInit {
    /**
     * 标题
     */
    readonly thyTitle = input.required<string>();

    /**
     * logo
     */
    readonly thyLogo = input.required<string>();

    readonly trigger = input<null | undefined | SafeAny>(null, { alias: 'thyTrigger' });

    readonly menus = model<ThyMenuRoute[]>([], {
        alias: 'thyMenus'
    });

    /**
     *  menu 菜单的头部点击事件
     */
    readonly menuHeaderClick = output<Event>();

    /**
     *  自定义标题和 logo
     */
    public readonly menuHeaderTemplate = contentChild<TemplateRef<HTMLElement>>('menuHeader');

    /**
     * 自定义菜单显示
     */
    public readonly menuTemplate = contentChild<TemplateRef<HTMLElement>>('menuList');

    /**
     * 自定义菜单栏底部内容
     */
    readonly menuFooterTemplate = contentChild<TemplateRef<any>>('menuFooter');

    /**
     * 自定义右上角内容
     */
    public readonly headerRightContentTemplate = contentChild<TemplateRef<any>>('headerRightContent');

    /**
     * 自定义 footer
     */
    public readonly footerTemplate = contentChild<TemplateRef<any>>('footer');

    public isCollapsed = cache.signal('menu-is-collapsed', {
        defaultValue: false
    });

    constructor(
        public globalStore: ThyGlobalStore,
        public route: ActivatedRoute
    ) {
        const activeRoute = this.route.firstChild?.firstChild?.routeConfig;
        this.globalStore.initialize().subscribe((menus) => {
            this.globalStore.pureUpdateActiveMenuByRoute(activeRoute);
            this.menus.update((value) => {
                return value && value.length ? value : menus;
            });
        });
    }

    ngOnInit(): void {}

    collapsedChange(isCollapsed: boolean) {
        this.isCollapsed.set(isCollapsed);
    }
}
