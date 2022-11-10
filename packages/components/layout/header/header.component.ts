import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { MixinBase, mixinUnsubscribe } from 'ngx-tethys/core';
import { takeUntil, Observable } from 'rxjs';
import { Route, ThyGlobalStore } from '@tethys/pro/core';

@Component({
    selector: 'thy-pro-header',
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-pro-header'
    }
})
export class ThyProHeaderComponent extends mixinUnsubscribe(MixinBase) implements OnInit {
    @Input() public headerRightContentTemplate!: TemplateRef<HTMLElement>;

    @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter();

    public title$!: Observable<Route | undefined>;

    public isCollapsed: boolean = false;

    constructor(public globalStore: ThyGlobalStore) {
        super();
        this.title$ = this.globalStore.select((state) => state.activeMenu);
    }
    ngOnInit(): void {}

    changeCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.collapsedChange.emit(this.isCollapsed);
    }
}
