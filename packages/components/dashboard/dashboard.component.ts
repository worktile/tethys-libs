import { EventEmitter, OnChanges, Output, SimpleChanges, Type, TemplateRef } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CompactType, DisplayGrid, GridsterComponentInterface, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { ThyWidgetItem, WidgetGridsterItem } from './dashboard.class';
import { ThyDashboardWidgetComponent } from './widget/widget.component';

@Component({
    selector: 'thy-dashboard',
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-dashboard' }
})
export class ThyDashboardComponent implements OnInit, OnChanges {
    /**
     * 仪表盘部件对应组件或模版映射
     */
    @Input() thyWidgetViews: Record<string, Type<ThyDashboardWidgetComponent> | TemplateRef<any>> = {};

    /**
     * 仪表盘部件是否允许拖拽
     */
    @Input() thyDraggable: boolean = false;

    /**
     * 仪表盘部件数据
     */
    @Input() set thyWidgets(value: ThyWidgetItem[]) {
        this.widgetGridsterItems = this.buildWidgetGridsterItems(value);
    }

    /**
     * 部件变更
     */
    @Output() thyWidgetsChange: EventEmitter<ThyWidgetItem[]> = new EventEmitter();

    public widgetGridsterItems: WidgetGridsterItem[] = [];

    public config: GridsterConfig = {
        gridType: GridType.VerticalFixed,
        margin: 8,
        compactType: CompactType.None,
        displayGrid: DisplayGrid.None,
        maxCols: 12,
        minCols: 12,
        fixedRowHeight: 120,
        disableScrollHorizontal: true,
        pushItems: true,
        disablePushOnDrag: true,
        useTransformPositioning: false,
        // swapWhileDragging: true,
        itemChangeCallback: () => {
            const widgets = this.buildWidgetItems();
            this.thyWidgetsChange.emit(widgets);
        },
        itemRemovedCallback: () => {
            const widgets = this.buildWidgetItems();
            this.thyWidgetsChange.emit(widgets);
        }
    };

    @ViewChild('gridster')
    gridsterComponent!: GridsterComponentInterface;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.setDraggable(this.thyDraggable);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.thyDraggable?.firstChange) {
            this.setDraggable(this.thyDraggable);
        }
    }

    trackBy(index: number, item: WidgetGridsterItem) {
        return item.widget?._id || index;
    }

    private buildWidgetGridsterItems(widgets: ThyWidgetItem[]) {
        return (widgets || []).map((widget) => {
            const gridsterItem: WidgetGridsterItem = {
                x: widget.position?.x,
                y: widget.position?.y,
                cols: widget.size.cols,
                rows: widget.size.rows,
                widget: widget
            };

            return gridsterItem;
        });
    }

    private setDraggable(draggable: boolean) {
        if (draggable) {
            this.config = {
                ...this.config,
                minRows: 12,
                draggable: {
                    enabled: true
                },
                resizable: {
                    enabled: true
                },
                displayGrid: DisplayGrid.Always
            };
        } else {
            this.config = {
                ...this.config,
                minRows: 1,
                draggable: {
                    enabled: false
                },
                resizable: {
                    enabled: false
                },
                displayGrid: DisplayGrid.None
            };
        }
        this.cdr.markForCheck();
    }

    private buildWidgetItems() {
        return (this.gridsterComponent?.grid || []).map((gridsterItem) => {
            const widgetGridsterItem = gridsterItem.item as WidgetGridsterItem;
            return {
                ...widgetGridsterItem.widget,
                position: { x: widgetGridsterItem.x, y: widgetGridsterItem.y },
                size: { cols: widgetGridsterItem.cols, rows: widgetGridsterItem.rows }
            };
        });
    }
}
