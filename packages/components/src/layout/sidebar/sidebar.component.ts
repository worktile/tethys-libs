import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { GlobalStore } from '../../core';
import { Route, Routes } from '../../entities';

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

    constructor(public globalConfigStore: GlobalStore) {}

    ngOnInit(): void {}

    setActiveMenu(activeMenu: Route) {
        this.globalConfigStore.pureUpdateActiveMenu(activeMenu);
    }
}
