import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    input,
    output,
    viewChild
} from '@angular/core';
import {
    CompactType,
    DisplayGrid,
    GridType,
    GridsterComponent,
    GridsterConfig,
    GridsterItem,
    GridsterItemComponent
} from 'angular-gridster2';
import { ThyViewOutletDirective } from 'ngx-tethys/shared';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ThyWidgetItem, ThyWidgetVieOutletWithContext, ThyWidgetViewOutlet, WidgetGridsterItem } from './dashboard.class';

@Component({
    selector: 'thy-dashboard',
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-dashboard' },
    imports: [GridsterComponent, GridsterItemComponent, ThyViewOutletDirective]
})
export class ThyDashboardComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    /**
     * 仪表盘部件对应组件或模版映射
     */
    readonly thyWidgetViews = input<Record<string, ThyWidgetViewOutlet | ThyWidgetVieOutletWithContext>>({});

    /**
     * 仪表盘部件是否允许拖拽
     */
    readonly thyDraggable = input<boolean>(false);

    /**
     * 仪表盘部件数据
     */
    readonly thyWidgets = input<ThyWidgetItem[]>([]);

    /**
     * 部件变更
     */
    readonly thyWidgetsChange = output<ThyWidgetItem[]>();

    /**
     * 仪表盘整体大小发生变化
     */
    readonly thyResizeChange = output<void>();

    readonly gridster = viewChild.required('gridster', { read: ElementRef });

    public widgetGridsterItems: WidgetGridsterItem[] = [];

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
            const widgets = this.thyWidgets();
            const changedWidget = widgets.find((widget) => {
                return widget._id === item.widget._id;
            });

            if (changedWidget) {
                changedWidget.position = { x: item.x, y: item.y };
                changedWidget.size = { cols: item.cols, rows: item.rows };
                this.thyWidgetsChange.emit(widgets);
            }
        }
    };

    constructor(
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit(): void {
        this.setDraggable(this.thyDraggable());
        this.widgetGridsterItems = this.buildWidgetGridsterItems();
        if (this.config.api && this.config.api.resize) {
            this.config.api.resize();
        }
    }

    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            this.createResizeObserver(this.gridster().nativeElement)
                .pipe(debounceTime(100), takeUntil(this.ngUnsubscribe$))
                .subscribe(() => {
                    if (this.config.api && this.config.api.resize) {
                        this.config.api.resize();
                    }
                    this.thyResizeChange.emit();
                });
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.thyWidgets?.firstChange) {
            this.widgetGridsterItems = this.buildWidgetGridsterItems();
        }
        if (!changes.thyDraggable?.firstChange) {
            this.setDraggable(this.thyDraggable());
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

    private buildWidgetGridsterItems() {
        const widgets = this.thyWidgets();
        const widgetViews = this.thyWidgetViews();
        return (widgets || []).map((widget) => {
            const widgetView = widgetViews[widget.type];
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
