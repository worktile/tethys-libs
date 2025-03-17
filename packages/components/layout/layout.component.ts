import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Route, Router, Routes, RouterOutlet } from '@angular/router';
import { ThyGlobalStore, ThyMenuRoute } from '@tethys/pro/core';
import { NgTemplateOutlet } from '@angular/common';
import { ThyProHeaderComponent } from './header/header.component';
import { ThyProSidebarComponent } from './sidebar/sidebar.component';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { cache } from '@tethys/cache';

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
    @Input() thyTitle!: string;

    /**
     * logo
     */
    @Input() thyLogo!: string;

    /**
     * 菜单数据
     */
    @Input() set thyMenus(value: ThyMenuRoute[]) {
        this.menus = value;
    }

    /**
     *  menu 菜单的头部点击事件
     */
    @Output() menuHeaderClick: EventEmitter<Event> = new EventEmitter();

    /**
     *  自定义标题和 logo
     */
    @ContentChild('menuHeader') public menuHeaderTemplate!: TemplateRef<HTMLElement>;

    /**
     * 自定义菜单显示
     */
    @ContentChild('menuList') public menuTemplate!: TemplateRef<HTMLElement>;

    /**
     * 自定义菜单栏底部内容
     */
    @ContentChild('menuFooter') menuFooterTemplate!: TemplateRef<any>;

    /**
     * 自定义右上角内容
     */
    @ContentChild('headerRightContent') public headerRightContentTemplate!: TemplateRef<any>;

    /**
     * 自定义 footer
     */
    @ContentChild('footer') public footerTemplate!: TemplateRef<any>;

    public menus!: ThyMenuRoute[];

    public isCollapsed = cache.signal('menu-is-collapsed', {
        defaultValue: false
    });

    constructor(
        public globalStore: ThyGlobalStore,
        public route: ActivatedRoute
    ) {
        this.globalStore.initialize();
        const activeRoute = this.route.firstChild?.firstChild?.routeConfig;
        this.globalStore.pureUpdateActiveMenuByRoute(activeRoute);
    }

    ngOnInit(): void {
        this.menus = this.menus && this.menus.length ? this.menus : this.globalStore.snapshot.menus;
    }

    collapsedChange(isCollapsed: boolean) {
        this.isCollapsed.set(isCollapsed);
    }
}
