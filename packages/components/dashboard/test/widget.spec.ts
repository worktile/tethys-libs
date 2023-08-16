import { ThyDashboardWidgetHeaderComponent, ThyProDashboardModule } from '@tethys/pro/dashboard';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'thy-widget-header-basic-test',
    template: ` <thy-dashboard-widget-header [thyTitle]="title" [thyDescription]="description"> </thy-dashboard-widget-header> `,
    standalone: true,
    imports: [ThyProDashboardModule]
})
export class ThyWidgetHeaderBasicTestComponent {
    title = '链接';
    description = '';
}

describe('thy-widget-header', () => {
    let fixture: ComponentFixture<ThyWidgetHeaderBasicTestComponent>;
    let component: ThyWidgetHeaderBasicTestComponent;
    let debugElement: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ThyProDashboardModule, ThyWidgetHeaderBasicTestComponent],
            providers: []
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ThyWidgetHeaderBasicTestComponent);
        component = fixture.debugElement.componentInstance;
        debugElement = fixture.debugElement.query(By.directive(ThyDashboardWidgetHeaderComponent));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(debugElement).toBeTruthy();
    });

    it('should has correct title', () => {
        fixture.detectChanges();

        const title = fixture.debugElement.query(By.css('.widget-header-title'));
        expect(title).toBeTruthy();
        expect(title.nativeElement.innerText).toEqual('链接');
    });

    it('should has correct class without description', () => {
        fixture.detectChanges();
        const title = fixture.debugElement.query(By.css('.widget-header-title'));
        expect(title.nativeElement.classList.contains('mb-3')).toBeTrue();
    });

    it('should has no description element without description', () => {
        const description = fixture.debugElement.query(By.css('.widget-header-description'));
        expect(description).toBeFalsy();
    });

    it('should render description correctly', () => {
        component.description = '描述';
        fixture.detectChanges();
        const title = fixture.debugElement.query(By.css('.widget-header-title'));
        const description = fixture.debugElement.query(By.css('.widget-header-description'));
        expect(title.nativeElement.classList.contains('mb-3')).toBeFalse();
        expect(description).toBeTruthy();
    });
});
