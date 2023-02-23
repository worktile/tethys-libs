import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThyProMediaModule, ThyVideoPlayerComponent } from '@tethys/pro/media';

@Component({
    selector: 'thy-test-cropper-basic',
    template: ``
})
export class ThyCropperTestBasicComponent {}

describe('cropperComponent', () => {
    let component: ThyCropperTestBasicComponent;
    let fixture: ComponentFixture<ThyCropperTestBasicComponent>;
    let debugElement: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ThyCropperTestBasicComponent],
            imports: [ThyProMediaModule]
        }).compileComponents();
    }));

    describe('cropper', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(ThyCropperTestBasicComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement.query(By.directive(ThyVideoPlayerComponent));
            fixture.detectChanges();
        });
    });
});
