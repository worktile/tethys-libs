import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CompactType, DisplayGrid, GridsterComponentInterface, GridsterConfig, GridType } from 'angular-gridster2';
import { helpers } from 'ngx-tethys/util';
import { WidgetGridsterItem, WidgetInfo } from './dashboard.entity';

@Component({
    selector: 'thy-pro-dashboard',
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-pro-dashboard' }
})
export class ThyProDashboardComponent implements OnInit {
    /**
     * widgets 仪表盘内部件数据
     */
    @Input() set thyWidgets(value: WidgetInfo[]) {
        this.widgetGridsterItems = this.buildWidgetGridsterItems(value);
    }

    /**
     * gridster config
     */
    @Input() set thyGristerConfig(value: GridsterConfig) {
        this.config = Object.assign({}, this.config, value);
    }

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
        itemChangeCallback: (gridsterItem) => {
            this.changedWidgetGridsterItems.push(gridsterItem as WidgetGridsterItem);
        }
    };

    public editing = false;

    public widgetGridsterItems: WidgetGridsterItem[] = [];

    private changedWidgetGridsterItems: WidgetGridsterItem[] = [];

    @ViewChild('gridster')
    gridsterComponent!: GridsterComponentInterface;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {}

    trackBy(index: number, item: WidgetGridsterItem) {
        return item.widget._id || index;
    }

    private buildWidgetGridsterItems(widgets: WidgetInfo[]) {
        const changedWidgetGridsterItemsMap = helpers.keyBy(this.changedWidgetGridsterItems, 'widget._id');
        return (widgets || []).map((widget) => {
            const changedWidgetGridsterItem = changedWidgetGridsterItemsMap[widget._id];
            const gridsterItem: WidgetGridsterItem = {
                x: widget.position.x,
                y: widget.position.y,
                cols: widget.size.cols,
                rows: widget.size.rows,
                widget: widget
                // minItemCols: minSize.cols,
                // minItemRows: minSize.rows
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

    // 编辑切换，给外部使用
    toggleManageWidget() {
        this.editing = !this.editing;
        if (this.editing) {
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

    // 保存编辑部件，给外部使用
    saveWidget() {
        this.changedWidgetGridsterItems = [];
        let widgets: WidgetInfo[] = [];
        if (this.widgetGridsterItems.length) {
            widgets = this.buildTemporaryWidgets();
        }

        return widgets;
    }
}
