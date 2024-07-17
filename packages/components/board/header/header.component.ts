import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, booleanAttribute, input } from '@angular/core';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyTooltip, ThyTooltipDirective } from 'ngx-tethys/tooltip';
import { ThyBoardEntry } from '../entities';
import { ThyButton } from 'ngx-tethys/button';

@Component({
    selector: 'thy-board-header',
    templateUrl: 'header.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ThyFlexibleText, ThyIcon, ThyTooltipDirective, ThyButton],
    host: {
        class: 'thy-board-groups-header'
    }
})
export class ThyBoardHeaderComponent implements OnInit {
    entries = input.required<ThyBoardEntry[]>();

    @Input({ transform: booleanAttribute }) hasLane = false;

    @Input() isExpandAll = true;

    @Output() expandAll = new EventEmitter<boolean>();

    public isFullscreen = false;

    constructor() {}

    ngOnInit() {}

    expandAllLane() {
        this.isExpandAll = !this.isExpandAll;
        this.expandAll.emit(this.isExpandAll);
    }

    existFullscreen() {}

    enterFullscreen() {
        this.isExpandAll = !this.isExpandAll;
        this.expandAll.emit(this.isExpandAll);
    }
}
