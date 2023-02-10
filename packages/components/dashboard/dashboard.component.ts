import { OnChanges, SimpleChanges, Type } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CompactType, DisplayGrid, GridsterComponentInterface, GridType } from 'angular-gridster2';
import { helpers } from 'ngx-tethys/util';
import { ThyDashboardConfig, ThyWidgetItem, WidgetGridsterItem } from './dashboard.class';
import { ThyDashboardWidgetComponent } from './widget/widget.component';

@Component({
    selector: 'thy-dashboard',
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-dashboard' }
})
export class ThyDashboardComponent implements OnInit, OnChanges {
    /**
     * 仪表盘部件数据
     */
    @Input() set thyWidgets(value: ThyWidgetItem[]) {
        this.widgetGridsterItems = this.buildWidgetGridsterItems(value);
    }

    /**
     * 仪表盘部件对应组件映射
     */
    @Input() thyWidgetComponents: Record<string, Type<ThyDashboardWidgetComponent>> = {};

    /**
     * 仪表盘部件是否允许拖拽
     */
    @Input() thyDraggable: boolean = false;

    /**
     * Config
     */
    @Input() set thyConfig(value: ThyDashboardConfig) {
        this.config = Object.assign({}, this.config, value);
    }

    public config: ThyDashboardConfig = {
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
        itemChangeCallback: (gridsterItem) => {
            this.changedWidgetGridsterItems.push(gridsterItem as WidgetGridsterItem);
        }
    };

    public widgetGridsterItems: WidgetGridsterItem[] = [];

    private changedWidgetGridsterItems: WidgetGridsterItem[] = [];

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
        const changedWidgetGridsterItemsMap = helpers.keyBy(this.changedWidgetGridsterItems, 'widget._id');
        return (widgets || []).map((widget) => {
            const changedWidgetGridsterItem = changedWidgetGridsterItemsMap[widget._id];
            const gridsterItem: WidgetGridsterItem = {
                x: widget.position?.x,
                y: widget.position?.y,
                cols: widget.size.cols,
                rows: widget.size.rows,
                widget: widget
            };
            if (changedWidgetGridsterItem) {
                gridsterItem.x = changedWidgetGridsterItem.x;
                gridsterItem.y = changedWidgetGridsterItem.y;
                gridsterItem.cols = changedWidgetGridsterItem.cols;
                gridsterItem.rows = changedWidgetGridsterItem.rows;
            }

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

    private buildTemporaryWidgets() {
        return (this.gridsterComponent.grid || []).map((gridsterItem) => {
            const widgetGridsterItem = gridsterItem.item as WidgetGridsterItem;
            return {
                ...widgetGridsterItem.widget,
                position: { x: widgetGridsterItem.x, y: widgetGridsterItem.y },
                size: { cols: widgetGridsterItem.cols, rows: widgetGridsterItem.rows }
            };
        });
    }

    // 保存编辑部件，给外部使用
    saveWidget() {
        this.changedWidgetGridsterItems = [];
        let widgets: ThyWidgetItem[] = [];
        if (this.widgetGridsterItems.length) {
            widgets = this.buildTemporaryWidgets();
        }

        return widgets;
    }
}
