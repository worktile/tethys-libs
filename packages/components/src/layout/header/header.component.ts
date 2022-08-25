import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MixinBase, mixinUnsubscribe } from 'ngx-tethys/core';
import { Observable } from 'rxjs';
import { Route, ThyGlobalStore } from '../../core';
import { ThySlideService } from 'ngx-tethys/slide';
import { ThyProSettingComponent } from './setting/setting.component';

@Component({
    selector: 'thy-pro-header',
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThyProHeaderComponent extends mixinUnsubscribe(MixinBase) implements OnInit {
    @Input() public headerRightContentTemplate!: TemplateRef<HTMLElement>;

    public title$!: Observable<Route | undefined>;

    public isCollapsed: boolean = false;

    constructor(public globalStore: ThyGlobalStore, private thySlideService: ThySlideService) {
        super();
        this.title$ = this.globalStore.select((state) => state.activeMenu);
    }
    ngOnInit(): void {}

    changeCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.collapsedChange.emit(this.isCollapsed);
    }

    openSettings(event: Event) {
        this.thySlideService.open(ThyProSettingComponent, {
            id: 'layout-settings',
            drawerContainer: '.thy-pro-layout-content'
        });
    }
}
