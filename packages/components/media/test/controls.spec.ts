import { provideHttpClient } from '@angular/common/http';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ThyVideoControlsComponent } from '../controls.component';

describe('ThyVideoControlsComponent', () => {
    let component: ThyVideoControlsComponent;
    let fixture: ComponentFixture<ThyVideoControlsComponent>;
    let mediaElementMock: HTMLMediaElement;

    beforeEach(async () => {
        // Mock HTMLMediaElement
        mediaElementMock = document.createElement('video') as HTMLMediaElement;

        // 使用 Object.defineProperty 来定义可写的 duration 属性
        Object.defineProperty(mediaElementMock, 'duration', {
            writable: true,
            value: 100 // 设置视频时长
        });

        // 使用 Object.defineProperty 来定义可写的 paused 属性
        Object.defineProperty(mediaElementMock, 'paused', {
            writable: true,
            value: true
        });

        // 模拟 seekable 属性
        Object.defineProperty(mediaElementMock, 'seekable', {
            get: () => {
                return {
                    length: 1,
                    start: (index: number) => 0,
                    end: (index: number) => 100 * index
                } as TimeRanges;
            }
        });

        // 模拟 buffered 属性
        Object.defineProperty(mediaElementMock, 'buffered', {
            get: () => {
                return {
                    length: 1,
                    start: (index: number) => 0,
                    end: (index: number) => 100
                } as TimeRanges;
            }
        });

        mediaElementMock.currentTime = 0; // 初始化当前时间
        mediaElementMock.volume = 1; // 初始化音量
        mediaElementMock.pause = () => {
            Object.defineProperty(mediaElementMock, 'paused', {
                writable: true,
                value: false
            });
        };

        mediaElementMock.play = () => {
            Object.defineProperty(mediaElementMock, 'paused', {
                writable: true,
                value: true
            });
            return Promise.resolve();
        };

        await TestBed.configureTestingModule({
            imports: [ThyVideoControlsComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
                { provide: ElementRef, useValue: { nativeElement: mediaElementMock } },
                provideHttpClient()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ThyVideoControlsComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('thyMedia', new ElementRef(mediaElementMock));
        fixture.componentRef.setInput('thyProgressType', 'primary');
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should play the video', () => {
        spyOn(mediaElementMock, 'play').and.returnValue(Promise.resolve());
        component.playOrPause();
        expect(mediaElementMock.play).toHaveBeenCalled();
    });

    it('should change volume', () => {
        component.afterVolumeChange(50); // 设置音量为50%
        expect(mediaElementMock.volume).toBe(0.5);
        expect(mediaElementMock.muted).toBeFalse();
    });

    it('should mute and unmute the video', () => {
        component.muted(); // 进行静音
        expect(mediaElementMock.volume).toBe(0);
        expect(mediaElementMock.muted).toBeTrue();

        component.muted(); // 取消静音
        expect(mediaElementMock.volume).toBe(1);
        expect(mediaElementMock.muted).toBeFalse();
    });

    it('should update progress value on time update', () => {
        mediaElementMock.currentTime = 50; // 设置当前播放时间
        component.setProgressValue();
        expect(component.progressValue).toBe(50); // 应该是50%
    });

    it('should handle playback rate change', () => {
        component.playBackRateChange(2); // 设置播放速率为2x
        expect(mediaElementMock.playbackRate).toBe(2);
    });

    it('should update progress on mouse events', fakeAsync(() => {
        component.onMouseStart();
        expect(mediaElementMock.paused).toBeTrue(); // 应该暂停

        flush();
        fixture.detectChanges();

        expect(mediaElementMock.paused).toBeFalse(); // 应该播放

        component.onMouseEnd();
        fixture.detectChanges();
        expect(mediaElementMock.paused).toBeTrue(); // 应该暂停
    }));
});
