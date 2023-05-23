import { EventEmitter, OnChanges, Output, SimpleChanges, NgZone, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { ThyWidgetItem, WidgetGridsterItem, ThyWidgetVieOutletWithContext, ThyWidgetViewOutlet } from './dashboard.class';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';

@Component({
    selector: 'thy-dashboard',
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-dashboard' }
})
export class ThyDashboardComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    /**
     * 仪表盘部件对应组件或模版映射
     */
    @Input() thyWidgetViews: Record<string, ThyWidgetViewOutlet | ThyWidgetVieOutletWithContext> = {};

    /**
     * 仪表盘部件是否允许拖拽
     */
    @Input() thyDraggable: boolean = false;

    /**
     * 仪表盘部件数据
     */
    @Input() set thyWidgets(value: ThyWidgetItem[]) {
        this.widgets = value || [];
    }

    /**
     * 部件变更
     */
    @Output() thyWidgetsChange: EventEmitter<ThyWidgetItem[]> = new EventEmitter();

    @ViewChild('gridster', { static: true, read: ElementRef }) gridster!: ElementRef<HTMLElement>;

    public widgetGridsterItems: WidgetGridsterItem[] = [];

    private widgets!: ThyWidgetItem[];

    private ngUnsubscribe$ = new Subject<void>();

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
        outerMargin: true,
        itemChangeCallback: (item: GridsterItem) => {
            const changedWidget = this.widgets.find((widget) => {
                return widget._id === item.widget._id;
            });

            if (changedWidget) {
                changedWidget.position = { x: item.x, y: item.y };
                changedWidget.size = { cols: item.cols, rows: item.rows };
                this.thyWidgetsChange.emit(this.widgets);
            }
        }
    };

    constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

    ngOnInit(): void {
        this.setDraggable(this.thyDraggable);
        this.widgetGridsterItems = this.buildWidgetGridsterItems(this.widgets);
        if (this.config.api && this.config.api.resize) {
            this.config.api.resize();
        }
    }

    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            this.createResizeObserver(this.gridster.nativeElement)
                .pipe(debounceTime(100), takeUntil(this.ngUnsubscribe$))
                .subscribe(() => {
                    if (this.config.api && this.config.api.resize) {
                        this.config.api.resize();
                    }
                });
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.thyWidgets?.firstChange) {
            this.widgetGridsterItems = this.buildWidgetGridsterItems(this.widgets);
        }
        if (!changes.thyDraggable?.firstChange) {
            this.setDraggable(this.thyDraggable);
            undefined;
        }
    }

    trackBy(index: number, item: WidgetGridsterItem) {
        return item.widget?._id || index;
    }

    createResizeObserver(element: HTMLElement) {
        return typeof ResizeObserver === 'undefined'
            ? of(null)
            : new Observable((observer) => {
                  const resize = new ResizeObserver((entries) => {
                      observer.next(entries);
                  });
                  resize.observe(element);
                  return () => {
                      resize.disconnect();
                  };
              });
    }

    private buildWidgetGridsterItems(widgets: ThyWidgetItem[]) {
        return (widgets || []).map((widget) => {
            const widgetView = this.thyWidgetViews[widget.type];
            const gridsterItem: WidgetGridsterItem = {
                x: widget.position?.x,
                y: widget.position?.y,
                cols: widget.size.cols,
                rows: widget.size.rows,
                minItemCols: widget.minSize?.cols,
                minItemRows: widget.minSize?.rows,
                outlet: (widgetView as ThyWidgetVieOutletWithContext)?.outlet || (widgetView as ThyWidgetViewOutlet),
                outletContext: {
                    ...(widgetView as ThyWidgetVieOutletWithContext)?.context,
                    widget
                },
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

    ngOnDestroy() {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
