import { ChangeDetectionStrategy, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { ThyGlobalStore } from '../../core';

@Component({
    selector: 'thy-pro-header',
    templateUrl: './header.component.html'
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThyProHeaderComponent implements OnInit {
    @Input() public headerRightContentTemplate!: TemplateRef<HTMLElement>;

    constructor(public globalStore: ThyGlobalStore) {}

    ngOnInit(): void {}
}
