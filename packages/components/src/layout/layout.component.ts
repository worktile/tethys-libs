import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalStore } from '../core';
import { Routes } from '../entities';

@Component({
    selector: 'thy-pro-layout',
    templateUrl: './layout.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-layout'
    }
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
    @Output() menuHeaderClick: EventEmitter<number> = new EventEmitter();

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

    constructor(public globalConfigStore: GlobalStore, private router: Router, public route: ActivatedRoute) {
        const routes = this.router.config[1];
        if (routes.children?.length) {
            this.globalConfigStore.initializeMenus(routes.children?.filter((item) => item.path) as Routes);
        }
    }

    ngOnInit(): void {
        this.menus = this.thyMenus && this.thyMenus.length ? this.thyMenus : this.globalConfigStore.snapshot.menus;
    }
}
