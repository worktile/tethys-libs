import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, model } from '@angular/core';
import { ThyGlobalStore } from '@tethys/pro/core';
import { ThyIcon } from 'ngx-tethys/icon';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
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
    standalone: true,
    imports: [ThyLayoutModule, ThyActionModule, ThyTooltipModule, NgTemplateOutlet, ThyIcon, AsyncPipe]
})
export class ThyProHeaderComponent implements OnInit {
    locale = injectLocale();

    @Input() public headerRightContentTemplate!: TemplateRef<HTMLElement>;

    public isCollapsed = model<boolean>();

    activeMenu = this.globalStore.select((state) => state.activeMenu);

    constructor(public globalStore: ThyGlobalStore) {}

    ngOnInit(): void {}

    changeCollapse() {
        this.isCollapsed.set(!this.isCollapsed());
    }
}
