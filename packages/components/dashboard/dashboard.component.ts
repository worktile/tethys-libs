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

    private gridsterComponent!: GridsterComponentInterface;

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
        initCallback: (grister) => {
            this.gridsterComponent = grister;
        },
        itemChangeCallback: (item: GridsterItem) => {
            const widgets = this.buildWidgetItems();
            if (widgets.length) {
                const isNewWidget = !widgets.some((widget) => {
                    return widget._id === item.widget._id;
                });
                if (isNewWidget) {
                    const newWidget = item.widget;
                    newWidget.position = { x: item.x, y: item.y };
                    newWidget.size = { cols: item.cols, rows: item.rows };
                    widgets.push(newWidget);
                }
                this.thyWidgetsChange.emit(widgets);
            }
        }
    };

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
                minItemCols: widget.minSize?.cols,
                minItemRows: widget.minSize?.rows,
                widget
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
            const widget = widgetGridsterItem.widget;
            widget.position = { x: widgetGridsterItem.x, y: widgetGridsterItem.y };
            widget.size = { cols: widgetGridsterItem.cols, rows: widgetGridsterItem.rows };
            return widget;
        });
    }
}
