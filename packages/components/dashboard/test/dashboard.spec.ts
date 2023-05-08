import { ThyDashboardComponent, ThyProDashboardModule, ThyWidgetItem } from '@tethys/pro/dashboard';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThyDashboardBasicNoticeWidgetComponent } from '../examples/basic/widgets/notice/notice.component';
import { ThyDashboardBasicLinksWidgetComponent } from '../examples/basic/widgets/links/links.component';

@Component({
    selector: 'thy-dashboard-basic-test',
    template: `
        <thy-dashboard
            [thyDraggable]="draggable"
            [(thyWidgets)]="widgets"
            [thyWidgetViews]="widgetViews"
            (thyWidgetsChange)="widgetsChange($event)"
        >
        </thy-dashboard>
    `
})
export class ThyDashboardBasicTestComponent {
    widgets: ThyWidgetItem[] = [
        {
            _id: '63c0d6f08e1cc40c3e41ad30',
            name: '公告',
            type: 'notice',
            size: {
                cols: 5,
                rows: 3
            },
            position: { x: 0, y: 0 },
            minSize: { cols: 5, rows: 3 }
        },
        {
            _id: '63c0d6f08e1cc40c3e41ad30',
            name: '链接',
            type: 'links',
            size: {
                cols: 4,
                rows: 3
            },
            position: { x: 0, y: 0 },
            minSize: { cols: 4, rows: 3 }
        }
    ];

    widgetViews = {
        notice: ThyDashboardBasicNoticeWidgetComponent,
        links: ThyDashboardBasicLinksWidgetComponent
    };

    draggable = false;

    widgetsChange = jasmine.createSpy('change');
}

describe('thy-dashboard', () => {
    let fixture: ComponentFixture<ThyDashboardBasicTestComponent>;
    let component: ThyDashboardBasicTestComponent;
    let debugElement: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ThyDashboardBasicTestComponent],
            imports: [ThyProDashboardModule],
            providers: []
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ThyDashboardBasicTestComponent);
        component = fixture.debugElement.componentInstance;
        debugElement = fixture.debugElement.query(By.directive(ThyDashboardComponent));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(debugElement).toBeTruthy();
    });

    it('should render widget correctly', () => {
        fixture.detectChanges();
        const widgets = fixture.debugElement.queryAll(By.css('.dashboard-girdster-item'));
        expect(widgets.length).toEqual(2);
    });

    it('should grister draggable enabled to be false', () => {
        fixture.detectChanges();
        expect(debugElement.componentInstance.config.draggable.enabled).toBe(false);
    });

    it('should grister draggable enabled to be true when draggable is true', () => {
        component.draggable = true;
        fixture.detectChanges();
        expect(debugElement.componentInstance.config.draggable.enabled).toBe(true);
    });

    // it('should call widgets change when widget position or size changed', () => {
    //     fixture.detectChanges();
    //     component.widgets = [
    //         ...component.widgets,
    //         {
    //             _id: '63c0d6f08e1cc40c3e41ad33',
    //             name: '链接',
    //             type: 'links',
    //             size: {
    //                 cols: 4,
    //                 rows: 3
    //             },
    //             position: { x: 0, y: 0 },
    //             minSize: { cols: 4, rows: 3 }
    //         }
    //     ];
    //     fixture.detectChanges();
    //     expect(component.widgetsChange).toHaveBeenCalledTimes(1);
    // });
});
