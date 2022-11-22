import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThyAudioPlayerComponent, ThyProMediaModule, ThyVideoPlayerComponent } from '@tethys/pro/media';

@Component({
    selector: 'thy-test-video-basic',
    template: `
        <thy-video-player [thyFileSrc]="src" [thyMuted]="muted" [thyAutoplay]="autoplay" [thyControls]="controls"></thy-video-player>
    `
})
export class ThyVideoTestBasicComponent {
    @ViewChild(ThyVideoPlayerComponent) videoPlayer: ThyVideoPlayerComponent | undefined;
    src = 'test.mp4';
    muted = false;
    autoplay = true;
    controls = false;
}

@Component({
    selector: 'thy-test-audio-basic',
    template: `
        <thy-audio-player [thyFileSrc]="src" [thyMuted]="muted" [thyAutoplay]="autoplay" [thyControls]="controls"></thy-audio-player>
    `
})
export class ThyAudioTestBasicComponent {
    @ViewChild(ThyAudioPlayerComponent) audioPlayer: ThyAudioPlayerComponent | undefined;
    src = 'test.aac';
    muted = false;
    autoplay = true;
    controls = false;
}

describe('mediaViewerComponent', () => {
    let videoComponent: ThyVideoTestBasicComponent;
    let audioComponent: ThyAudioTestBasicComponent;
    let videoFixture: ComponentFixture<ThyVideoTestBasicComponent>;
    let audioFixture: ComponentFixture<ThyAudioTestBasicComponent>;
    let videoDebugElement: DebugElement;
    let audioDebugElement: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ThyVideoTestBasicComponent, ThyAudioTestBasicComponent],
            imports: [ThyProMediaModule]
        }).compileComponents();
    }));

    describe('videoViewerComponent', () => {
        beforeEach(() => {
            videoFixture = TestBed.createComponent(ThyVideoTestBasicComponent);
            videoComponent = videoFixture.componentInstance;
            videoDebugElement = videoFixture.debugElement.query(By.directive(ThyVideoPlayerComponent));
            videoFixture.detectChanges();
        });

        it('should create', () => {
            expect(videoComponent).toBeTruthy();
            expect(videoFixture).toBeTruthy();
        });

        it('should thyAutoplay thyControls thyMuted worked', fakeAsync(() => {
            mediaPropertyWorked(videoComponent, videoDebugElement, 'video');
        }));

        it('should not show error-tip when resource is correct', fakeAsync(() => {
            const errorTip = videoDebugElement.nativeElement.querySelector('.error-tip');
            expect(errorTip).toBeFalsy();
        }));
    });

    describe('audioViewerComponent', () => {
        beforeEach(() => {
            audioFixture = TestBed.createComponent(ThyAudioTestBasicComponent);
            audioComponent = audioFixture.componentInstance;
            audioDebugElement = audioFixture.debugElement.query(By.directive(ThyAudioPlayerComponent));
            audioFixture.detectChanges();
        });

        it('should create', () => {
            expect(audioComponent).toBeTruthy();
            expect(audioFixture).toBeTruthy();
        });

        it('should thyAutoplay thyControls thyMuted worked', fakeAsync(() => {
            mediaPropertyWorked(audioComponent, audioDebugElement, 'audio');
        }));

        it('should not show error-tip when resource is correct', fakeAsync(() => {
            const errorTip = audioDebugElement.nativeElement.querySelector('.error-tip');
            expect(errorTip).toBeFalsy();
        }));
    });

    function mediaPropertyWorked(
        component: ThyVideoTestBasicComponent | ThyAudioTestBasicComponent,
        debugElement: DebugElement,
        mediaName: string
    ) {
        const mediaComponent = debugElement.nativeElement.querySelector(mediaName);
        expect(mediaComponent.controls).toEqual(component.controls);
        expect(mediaComponent.muted).toEqual(component.muted);
        expect(mediaComponent.autoplay).toEqual(component.autoplay);
        expect(mediaComponent.played).toBeTruthy();
    }
});
