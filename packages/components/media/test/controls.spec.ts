import { AfterViewInit, ChangeDetectorRef, Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ThyProMediaModule } from '@tethys/pro/media';
import { ThyDropdownDirective } from 'ngx-tethys/dropdown';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { dispatchMouseEvent } from 'ngx-tethys/testing';
import { SafeAny } from 'ngx-tethys/types';
import { ThyVideoControlsComponent } from '../controls.component';

@Component({
    selector: 'thy-test-controls-basic',
    template: `
        <video #videoElement [src]="src" [muted]="muted"></video>
        <thy-video-controls [thyMedia]="video" [thyProgressType]="progressType"> </thy-video-controls>
    `,
    standalone: true,
    imports: [ThyVideoControlsComponent]
})
export class ThyVideoControlsTestBasicComponent implements AfterViewInit {
    @ViewChild(ThyVideoControlsComponent) controls!: ThyVideoControlsComponent;

    @ViewChild('videoElement') videoElement!: HTMLMediaElement;

    muted = true;

    src = 'assets/media/video.mp4';

    video: any;

    progressType = 'primary';

    constructor(public cdr: ChangeDetectorRef) {}

    ngAfterViewInit() {
        this.video = this.videoElement;
        this.cdr.detectChanges();
    }
}

describe('mediaComponent', () => {
    let videoControlsComponent: ThyVideoControlsTestBasicComponent;
    let videoControlsFixture: ComponentFixture<ThyVideoControlsTestBasicComponent>;
    let videoControlsDebugElement: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [ThyVideoControlsTestBasicComponent, ThyProMediaModule, NoopAnimationsModule, ThyPopoverModule]
        }).compileComponents();
    }));

    describe('videoControlsComponent', () => {
        beforeEach(() => {
            videoControlsFixture = TestBed.createComponent(ThyVideoControlsTestBasicComponent);
            videoControlsComponent = videoControlsFixture.componentInstance;
            videoControlsDebugElement = videoControlsFixture.debugElement.query(By.directive(ThyVideoControlsComponent));
            videoControlsFixture.detectChanges();
        });

        it('should create', () => {
            expect(videoControlsComponent).toBeTruthy();
            expect(videoControlsFixture).toBeTruthy();
        });

        it('should has thy-media-controls-paused class default', () => {
            expectPausedControls();
        });

        it('should call onPlay or onPaused when click play button and paused', (done) => {
            expectPausedControls();

            videoControlsFixture.detectChanges();

            function pausedClick() {
                const pausedSpy = spyOn(videoControlsComponent.controls, 'onPause').and.callThrough();
                const playButton = document.querySelector('.controls-play') as HTMLElement;
                playButton.click();
                videoControlsFixture.detectChanges();

                expectPausedControls();
                expect(pausedSpy).toHaveBeenCalled();
            }

            loadedMediaAndPlay(done, pausedClick);
        });

        it('should set progress worked', (done) => {
            loadedMediaAndPlay(done, () => {
                const pointerElement = document.querySelector('.thy-media-progress-pointer') as HTMLElement;
                const progressRailElement = document.querySelector('.thy-media-progress-rail');

                dispatchMouseEvent(pointerElement, 'mousedown', progressRailElement?.clientWidth);
                dispatchMouseEvent(pointerElement, 'mouseup');
            });
        });

        it('should mute worked when muted button click', (done) => {
            expect(videoControlsComponent.controls.mediaHtmlElement.muted).toBeTruthy();

            function mutedClick() {
                const mutedDebugElement = videoControlsDebugElement.query(By.css('.controls-muted'));
                const mutedButton = mutedDebugElement.nativeElement;
                const dropdown = mutedDebugElement.injector.get(ThyDropdownDirective);
                mutedButton.click();

                videoControlsFixture.detectChanges();

                expect(videoControlsComponent.controls.mediaHtmlElement.muted).toBeFalsy();
                expect(videoControlsComponent.controls.mediaHtmlElement.volume).toEqual(1);

                dropdown.hide();
                mutedButton.click();

                videoControlsFixture.detectChanges();

                expect(videoControlsComponent.controls.mediaHtmlElement.muted).toBeTruthy();
                expect(videoControlsComponent.controls.mediaHtmlElement.volume).toEqual(0);
            }

            loadedMediaAndPlay(done, mutedClick);
        });

        it('should set volume worked', fakeAsync(() => {
            const mutedDebugElement = videoControlsDebugElement.query(By.css('.controls-muted'));
            const mutedButton = mutedDebugElement.nativeElement;
            const dropdown = mutedDebugElement.injector.get(ThyDropdownDirective);
            mutedButton.click();

            videoControlsFixture.detectChanges();
            tick();

            const pointerElement = document.querySelector('.volume-progress .thy-media-progress-pointer') as HTMLElement;
            const progressRailElement = document.querySelector('.volume-progress .thy-media-progress-rail');

            dispatchMouseEvent(pointerElement, 'mousedown', progressRailElement?.clientWidth);
            dispatchMouseEvent(pointerElement, 'mouseup');

            expect(videoControlsComponent.controls.mediaHtmlElement.muted).toEqual(false);
            expect(videoControlsComponent.controls.mediaHtmlElement.volume).toEqual(1);
            expect(videoControlsComponent.controls.tempVolume).toEqual(1);

            dropdown.hide();
            flush();
        }));

        it('should playbackRate worked when muted button click', fakeAsync(() => {
            expect(videoControlsComponent.controls.mediaHtmlElement.playbackRate).toEqual(1);
            const actionChangeSpy = spyOn(videoControlsComponent.controls, 'actionActiveChange').and.callThrough();

            const rateDebugElement = videoControlsDebugElement.query(By.css('.controls-playback-rate'));
            const dropdown = rateDebugElement.injector.get(ThyDropdownDirective);
            dropdown.show();

            tick();
            videoControlsFixture.detectChanges();
            tick();

            expect(actionChangeSpy).toHaveBeenCalledWith(true);

            const dropdownMenus = document.querySelectorAll('.dropdown-menu-item');
            (dropdownMenus[0] as HTMLElement).click();

            videoControlsFixture.detectChanges();
            tick();

            expect(actionChangeSpy).toHaveBeenCalledWith(false);
            expect(videoControlsComponent.controls.mediaHtmlElement.playbackRate).toEqual(0.5);
        }));

        it('should actionActiveChange worked', (done) => {
            videoControlsComponent.controls.actionActiveChange(true);
            videoControlsFixture.detectChanges();

            expectPausedControls();

            function actionInActive() {
                videoControlsComponent.controls.actionActiveChange(false);
                videoControlsFixture.detectChanges();
                expectPlayingControls();
            }

            loadedMediaAndPlay(done, actionInActive);
        });

        it('should progressType worked', fakeAsync(() => {
            videoControlsComponent.progressType = 'primary';
            videoControlsFixture.detectChanges();
            const progressComponent = document.querySelector('.thy-media-progress-primary');
            expect(progressComponent).toBeTruthy();

            videoControlsComponent.progressType = 'success';
            videoControlsFixture.detectChanges();
            const successProgressComponent = document.querySelector('.thy-media-progress-success');
            expect(successProgressComponent).toBeTruthy();

            videoControlsComponent.progressType = 'danger';
            videoControlsFixture.detectChanges();
            const dangerProgressComponent = document.querySelector('.thy-media-progress-danger');
            expect(dangerProgressComponent).toBeTruthy();

            videoControlsComponent.progressType = 'info';
            videoControlsFixture.detectChanges();
            const infoProgressComponent = document.querySelector('.thy-media-progress-info');
            expect(infoProgressComponent).toBeTruthy();
        }));

        it('should onCanPlay worked', fakeAsync(() => {
            videoControlsComponent.controls.onCanPlay();

            videoControlsFixture.detectChanges();

            const mediaHtmlElement = videoControlsComponent.controls.mediaHtmlElement;
            expect(mediaHtmlElement.ontimeupdate).toEqual(videoControlsComponent.controls.onTimeUpdate);
            expect(mediaHtmlElement.onwaiting).toEqual(videoControlsComponent.controls.onWaiting);
        }));

        it('should onMouseStart worked', fakeAsync(() => {
            const onPausedSpy = spyOn(videoControlsComponent.controls, 'onPause').and.callThrough();

            videoControlsComponent.controls.onMouseStart();

            videoControlsFixture.detectChanges();

            expect(onPausedSpy).toHaveBeenCalled();
        }));

        it('should onMouseEnd worked', fakeAsync(() => {
            const onPlaySpy = spyOn(videoControlsComponent.controls, 'onPlay').and.callThrough();

            videoControlsComponent.controls.onMouseEnd();

            videoControlsFixture.detectChanges();

            expect(onPlaySpy).toHaveBeenCalled();
        }));
    });

    function expectPlayingControls() {
        const playingClass = document.querySelector('.thy-media-controls-playing');
        const pausedClass = document.querySelector('.thy-media-controls-paused');
        expect(playingClass).not.toBeNull();
        expect(pausedClass).toBeNull();
    }

    function expectPausedControls() {
        const playing = document.querySelector('.thy-media-controls-playing');
        const paused = document.querySelector('.thy-media-controls-paused');
        expect(playing).toBeNull();
        expect(paused).not.toBeNull();
    }

    function loadedMediaAndPlay(done: SafeAny, callback?: SafeAny) {
        videoControlsComponent.video.nativeElement.addEventListener('loadedmetadata', () => {
            const playSpy = spyOn(videoControlsComponent.controls, 'onPlay').and.callThrough();

            const playButton = document.querySelector('.controls-play') as HTMLElement;
            playButton.click();

            videoControlsFixture.detectChanges();

            expectPlayingControls();
            expect(playSpy).toHaveBeenCalled();

            if (callback) {
                callback();
            }

            done();
        });
    }
});
