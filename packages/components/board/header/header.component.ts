import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    booleanAttribute,
    computed,
    input
} from '@angular/core';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyTooltipDirective } from 'ngx-tethys/tooltip';
import { ThyBoardEntry } from '../entities';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ThyAction } from 'ngx-tethys/action';

@Component({
    selector: 'thy-board-header',
    templateUrl: 'header.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ThyFlexibleText, ThyIcon, ThyTooltipDirective, NgTemplateOutlet, ThyAction, NgClass, NgStyle],
    host: {
        class: 'thy-board-header'
    }
})
export class ThyBoardHeaderComponent implements OnInit {
    entries = input.required<ThyBoardEntry[]>();

    @Input({ transform: booleanAttribute }) hasLane = false;

    @Input() allLanesExpanded = true;

    @Input() headerTemplateRef: TemplateRef<any> | undefined;

    /**
     * 是否支持栏的收起展开
     * @default false
     * @type boolean
     */
    entryCollapsible = input(false, { transform: booleanAttribute });

    /**
     * 是否有栏已收起
     * @default false
     * @type boolean
     */
    hasCollapsedEntry = input(false, { transform: booleanAttribute });

    container = input.required<ElementRef>();

    @Output() expandAllLanes = new EventEmitter<boolean>();

    /**
     * 展开收起栏事件
     */
    @Output() expandEntry = new EventEmitter<{ entry: ThyBoardEntry; expanded: boolean }>();

    public isFullscreen = false;

    public containerClientHeight = computed(() => {
        return this.container().nativeElement.clientHeight;
    });

    constructor() {}

    ngOnInit() {}

    expandAllLane() {
        this.allLanesExpanded = !this.allLanesExpanded;
        this.expandAllLanes.emit(this.allLanesExpanded);
    }

    existFullscreen() {}

    enterFullscreen() {}

    expandBoardEntry(event: ThyBoardEntry) {
        this.expandEntry.emit({ entry: event, expanded: !event.expanded });
    }
}
