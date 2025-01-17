import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { MixinBase, mixinUnsubscribe } from 'ngx-tethys/core';
import { takeUntil, Observable } from 'rxjs';
import { Route, ThyGlobalStore } from '@tethys/pro/core';
import { ThyIcon } from 'ngx-tethys/icon';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyLayoutModule } from 'ngx-tethys/layout';

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
export class ThyProHeaderComponent extends mixinUnsubscribe(MixinBase) implements OnInit {
    @Input() public headerRightContentTemplate!: TemplateRef<HTMLElement>;

    @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter();

    public isCollapsed: boolean = false;

    activeMenu = this.globalStore.select((state) => state.activeMenu);

    constructor(public globalStore: ThyGlobalStore) {
        super();
    }

    ngOnInit(): void {}

    changeCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.collapsedChange.emit(this.isCollapsed);
    }
}
