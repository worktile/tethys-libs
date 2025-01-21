import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    TemplateRef,
    booleanAttribute,
    computed,
    input,
    output
} from '@angular/core';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyTooltipDirective } from 'ngx-tethys/tooltip';
import { ThyBoardEntry } from '../entities';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ThyAction } from 'ngx-tethys/action';
import { SafeAny } from 'ngx-tethys/types';
import { injectLocale, ThyI18nPipe } from '@tethys/pro/i18n';

@Component({
    selector: 'thy-board-header',
    templateUrl: 'header.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ThyFlexibleText, ThyIcon, ThyTooltipDirective, NgTemplateOutlet, ThyAction, NgClass, NgStyle, ThyI18nPipe],
    host: {
        class: 'thy-board-header'
    }
})
export class ThyBoardHeaderComponent implements OnInit {
    locale = injectLocale();

    entries = input.required<ThyBoardEntry[]>();

    hasLane = input(false, { transform: booleanAttribute });

    @Input({ transform: booleanAttribute }) allLanesExpanded = true;

    headerTemplateRef = input<TemplateRef<SafeAny>>();

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

    expandAllLanes = output<boolean>();

    /**
     * 展开收起栏事件
     */
    expandEntry = output<{ entry: ThyBoardEntry; expanded: boolean }>();

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

    expandBoardEntry(event: ThyBoardEntry) {
        this.expandEntry.emit({ entry: event, expanded: !event.expanded });
    }
}
