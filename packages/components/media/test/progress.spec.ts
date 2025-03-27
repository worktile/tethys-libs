import { Component, DebugElement, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { dispatchMouseEvent } from 'ngx-tethys/testing';
import { ThyProMediaModule } from '../module';
import { ThyMediaProgressComponent } from '../progress.component';

@Component({
    template: `
        <thy-media-progress
            [thyDirection]="direction"
            [thyProgressValue]="progressValue"
            [thyBufferedValue]="bufferedValue"
            [thyProgressType]="progressType"
            (thyMoveStart)="onMouseStart()"
            (thyMoveEnd)="onMouseEnd()"
            (thyAfterChange)="afterProgressChange($event)"
        ></thy-media-progress>
    `,
    imports: [ThyMediaProgressComponent]
})
class ThyTestProgressComponent {
    direction = 'horizontal';

    progressValue = 0;

    bufferedValue = 0;

    progressType = 'primary';

    afterChangeSpy = jasmine.createSpy('after change');

    mouseStartSpy = jasmine.createSpy('mouseStart change');

    mouseEndSpy = jasmine.createSpy('after change');

    afterProgressChange(result: number) {
        this.progressValue = Math.ceil(result);
        this.afterChangeSpy(this.progressValue);
    }

    onMouseStart() {
        this.mouseStartSpy();
    }

    onMouseEnd() {
        this.mouseEndSpy();
    }
}

describe('ThyMediaProgressComponent', () => {
    let fixture: ComponentFixture<ThyTestProgressComponent>;
    let component: ThyTestProgressComponent;
    let debugElement: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ThyProMediaModule, ThyTestProgressComponent]
        });
        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ThyTestProgressComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.directive(ThyMediaProgressComponent));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set direction class', () => {
        const progress = debugElement.nativeElement;
        expect(progress.classList.contains('thy-media-progress-horizontal')).toBeTrue();

        component.direction = 'vertical';
        fixture.detectChanges();
        expect(progress.classList.contains('thy-media-progress-vertical')).toBeTrue();
    });

    it('should set progress value', () => {
        component.progressValue = 50;
        fixture.detectChanges();
        const progressTrack = fixture.nativeElement.querySelector('.thy-media-progress-track');
        expect(progressTrack.style.width).toBe('50%');
    });

    it('should set buffered value', () => {
        component.bufferedValue = 25;
        fixture.detectChanges();
        const progressBuffer = fixture.nativeElement.querySelector('.thy-media-progress-buffer');
        expect(progressBuffer.style.width).toBe('25%');
    });

    it('should update progress on mouse down and move', () => {
        const pointerElement = debugElement.query(By.css('.thy-media-progress-pointer')).nativeElement;
        const progress = debugElement.injector.get(ThyMediaProgressComponent);
        const position = (progress.progressRail as ElementRef).nativeElement.clientWidth + 100;
        expect(component.afterChangeSpy).not.toHaveBeenCalled();

        dispatchMouseEvent(pointerElement, 'mousedown', position);
        dispatchMouseEvent(pointerElement, 'mouseup');

        fixture.detectChanges();

        expect(component.progressValue).toBe(100);
        expect(component.afterChangeSpy).toHaveBeenCalledWith(100);
    });

    it('should trigger events', () => {
        const pointerElement = debugElement.query(By.css('.thy-media-progress-pointer')).nativeElement;
        const progress = debugElement.injector.get(ThyMediaProgressComponent);
        const position = (progress.progressRail as ElementRef).nativeElement.clientWidth;
        expect(component.mouseStartSpy).not.toHaveBeenCalled();
        expect(component.mouseEndSpy).not.toHaveBeenCalled();

        dispatchMouseEvent(pointerElement, 'mousedown', position);

        expect(component.mouseStartSpy).toHaveBeenCalled();
        expect(component.mouseEndSpy).not.toHaveBeenCalled();

        dispatchMouseEvent(pointerElement, 'mouseup');

        expect(component.mouseEndSpy).toHaveBeenCalled();
    });

    it('should handle errors', () => {
        const progress = debugElement.injector.get(ThyMediaProgressComponent);
        component.progressValue = -10;
        expect(progress.progressValue).toBe(0);

        component.bufferedValue = 200;
        fixture.detectChanges();
        const progressBuffer = fixture.nativeElement.querySelector('.thy-media-progress-buffer');
        expect(progressBuffer.style.width).toBe('100%');
    });
});
