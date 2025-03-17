import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThyAudioPlayerComponent, ThyProMediaModule, ThyVideoPlayerComponent } from '@tethys/pro/media';

@Component({
    selector: 'thy-test-video-basic',
    template: ` <thy-video-player [thySrc]="src"></thy-video-player> `,
    imports: [ThyProMediaModule]
})
export class ThyVideoTestBasicComponent {
    @ViewChild(ThyVideoPlayerComponent) videoPlayer: ThyVideoPlayerComponent | undefined;
    src = 'assets/media/video.mp4';
}

@Component({
    selector: 'thy-test-audio-basic',
    template: ` <thy-audio-player [thySrc]="src" [thyFileName]="fileName"></thy-audio-player> `,
    imports: [ThyProMediaModule]
})
export class ThyAudioTestBasicComponent {
    @ViewChild(ThyAudioPlayerComponent) audioPlayer: ThyAudioPlayerComponent | undefined;
    src = 'assets/media/mp3.mp3';

    fileName = '';
}

describe('mediaComponent', () => {
    let videoComponent: ThyVideoTestBasicComponent;
    let audioComponent: ThyAudioTestBasicComponent;
    let videoFixture: ComponentFixture<ThyVideoTestBasicComponent>;
    let audioFixture: ComponentFixture<ThyAudioTestBasicComponent>;
    let videoDebugElement: DebugElement;
    let audioDebugElement: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [ThyProMediaModule, ThyVideoTestBasicComponent, ThyAudioTestBasicComponent]
        }).compileComponents();
    }));

    describe('videoPlayerComponent', () => {
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

    describe('audioPlayerComponent', () => {
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

        it('should show correct fileName', fakeAsync(() => {
            expect(audioComponent.audioPlayer?.fileName).toEqual('');

            audioComponent.audioPlayer?.onCanPlay();
            audioFixture.detectChanges();
            expect(audioComponent.audioPlayer?.fileName).toEqual('mp3.mp3');

            audioComponent.fileName = 'test.mp3';
            audioComponent.audioPlayer?.onCanPlay();
            audioFixture.detectChanges();

            expect(audioComponent.audioPlayer?.fileName).toEqual('test.mp3');
        }));
    });

    function mediaPropertyWorked(
        component: ThyVideoTestBasicComponent | ThyAudioTestBasicComponent,
        debugElement: DebugElement,
        mediaName: string
    ) {
        const mediaComponent = debugElement.nativeElement.querySelector(mediaName);
        expect(mediaComponent.src.includes(component.src)).toBeTruthy();
    }
});
