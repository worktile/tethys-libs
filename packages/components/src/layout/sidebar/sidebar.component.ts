import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Route, Routes, ThyGlobalStore } from '../../core';

@Component({
    selector: 'thy-pro-sidebar',
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-layout thy-pro-sidebar'
    }
})
export class ThyProSidebarComponent implements OnInit {
    @Input() menus!: Routes;

    @Input() logo!: string;

    @Input() title!: string;

    @Input() public headerTemplate!: TemplateRef<HTMLElement>;

    @Input() public menuTemplate!: TemplateRef<HTMLElement>;

    @Input() public footerTemplate!: TemplateRef<HTMLElement>;

    constructor(public globalStore: ThyGlobalStore) {}

    ngOnInit(): void {}

    setActiveMenu(activeMenu: Route) {
        this.globalStore.pureUpdateActiveMenu(activeMenu);
    }
}
