import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, inject, model } from '@angular/core';
import { ThyGlobalStore } from '@tethys/pro/core';
import { ThyIcon } from 'ngx-tethys/icon';
import { NgTemplateOutlet } from '@angular/common';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { injectLocale } from '@tethys/pro/i18n';

@Component({
    selector: 'thy-pro-header',
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-pro-header'
    },
    imports: [ThyLayoutModule, ThyActionModule, ThyTooltipModule, NgTemplateOutlet, ThyIcon]
})
export class ThyProHeaderComponent implements OnInit {
    locale = injectLocale();

    @Input() public headerRightContentTemplate!: TemplateRef<HTMLElement>;

    public isCollapsed = model<boolean>();

    protected globalStore = inject(ThyGlobalStore);

    protected activeMenu = this.globalStore.select((state) => state.activeMenu);

    constructor() {}

    ngOnInit(): void {}

    changeCollapse() {
        this.isCollapsed.set(!this.isCollapsed());
    }
}
