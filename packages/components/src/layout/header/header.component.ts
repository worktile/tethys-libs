import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MixinBase, mixinUnsubscribe } from 'ngx-tethys/core';
import { takeUntil, Observable } from 'rxjs';
import { Route, ThyGlobalStore } from '../../core';

@Component({
    selector: 'thy-pro-header',
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThyProHeaderComponent extends mixinUnsubscribe(MixinBase) implements OnInit {
    @Input() public headerRightContentTemplate!: TemplateRef<HTMLElement>;

    public title$!: Observable<Route | undefined>;

    constructor(public globalStore: ThyGlobalStore) {
        super();
        this.title$ = this.globalStore.select((state) => state.activeMenu);
    }
    ngOnInit(): void {}
}
