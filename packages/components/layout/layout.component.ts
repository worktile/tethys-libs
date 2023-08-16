import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Route, Router, Routes, RouterOutlet } from '@angular/router';
import { ThyGlobalStore } from '@tethys/pro/core';
import { filterEmptyRoutePath } from './utils';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ThyProHeaderComponent } from './header/header.component';
import { ThyProSidebarComponent } from './sidebar/sidebar.component';
import { ThyLayoutModule } from 'ngx-tethys/layout';

@Component({
    selector: 'thy-pro-layout',
    templateUrl: './layout.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-layout thy-layout--has-sidebar thy-pro-layout'
    },
    standalone: true,
    imports: [ThyLayoutModule, ThyProSidebarComponent, ThyProHeaderComponent, RouterOutlet, NgIf, NgTemplateOutlet]
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
    @Input() set thyMenus(value: Routes) {
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

    public menus!: Routes;

    public isCollapsed: boolean = false;

    constructor(public globalStore: ThyGlobalStore, private router: Router, public route: ActivatedRoute) {
        const routes = this.router.config[1] as Route;
        const filterRoutes = filterEmptyRoutePath(routes);
        if (routes.children?.length) {
            this.globalStore.initializeMenus(filterRoutes);
        }
        // 获取路由信息，初始化到 ThyGlobalStore 的 activeMenu
        this.globalStore.pureUpdateActiveMenu(this.route.firstChild?.firstChild?.routeConfig as Route);
    }

    ngOnInit(): void {
        this.menus = this.menus && this.menus.length ? this.menus : this.globalStore.snapshot.menus;
    }

    collapsedChange(isCollapsed: boolean) {
        this.isCollapsed = isCollapsed;
    }
}
