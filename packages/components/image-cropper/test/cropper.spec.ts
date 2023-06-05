import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThyImageCropperComponent, ThyImageCropperModule } from '@tethys/pro/image-cropper';
import Cropper from 'cropperjs';
import { ThyCropperViewMode } from '../cropper.entity';

@Component({
    selector: 'thy-test-cropper-basic',
    template: `<thy-image-cropper
        #cropper
        [thyImage]="image"
        [thyImageErrorMessage]="errorMessage"
        [thyViewMode]="viewMode"
        [thyAspectRatio]="aspectRatio"
        (thyCropDataChanged)="cropDataChange()"
        style="width: 500px; height: 300px"
    ></thy-image-cropper>`
})
export class ThyImageCropperTestBasicComponent {
    @ViewChild(ThyImageCropperComponent, { static: true }) public imageCropper!: ThyImageCropperComponent;

    image: string | File = 'image.png';

    errorMessage = '图片加载错误';

    viewMode: ThyCropperViewMode = 0;

    aspectRatio = 4;

    cropDataChange = () => {};
}

describe('imageCropperComponent', () => {
    let component: ThyImageCropperTestBasicComponent;
    let fixture: ComponentFixture<ThyImageCropperTestBasicComponent>;
    let debugElement: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ThyImageCropperTestBasicComponent],
            imports: [ThyImageCropperModule]
        }).compileComponents();
    }));

    describe('cropper', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(ThyImageCropperTestBasicComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement.query(By.directive(ThyImageCropperComponent));
            fixture.detectChanges();
        });

        it('should cropper is be created', () => {
            expect(fixture).toBeTruthy();
            expect(component).toBeTruthy();
        });

        it('should get correct imageSrc when thyImage is src', () => {
            expect(component.imageCropper.imageSrc).toEqual(component.image as string);
        });

        it('should call setImageSrc when thyImage is file', () => {
            const imageSrcSpy = spyOn(component.imageCropper, 'setImageSrc').and.callThrough();
            const file = new File([''], 'image', { type: 'image/jpeg' });
            component.image = file;
            fixture.detectChanges();

            fixture.detectChanges();
            expect((component.imageCropper as any).imageFile).toEqual(file);
            expect(imageSrcSpy).toHaveBeenCalled();
        });

        it('should get correct errorMessage when set thyImageErrorMessage and loadError is true', () => {
            component.imageCropper.loadError = true;
            fixture.detectChanges();
            const errMessageElement = debugElement.nativeElement.querySelector('.alert.alert-warning');
            expect(errMessageElement.textContent).toEqual('图片加载错误');

            component.errorMessage = '自定义错误文案';
            fixture.detectChanges();
            expect(errMessageElement.textContent).toEqual('自定义错误文案');
        });

        it('should get correct viewMode aspectRatio when set thyViewMode or thyAspectRatio', () => {
            component.imageCropper.onLoad({ target: component.imageCropper.image.nativeElement } as Event);
            fixture.detectChanges();
            expect(component.imageCropper.cropperOptions.aspectRatio).toEqual(component.aspectRatio);
            expect(component.imageCropper.cropperOptions.viewMode).toEqual(component.viewMode);

            component.viewMode = 3;
            component.aspectRatio = 5;
            fixture.detectChanges();

            component.imageCropper.onLoad({ target: component.imageCropper.image.nativeElement } as Event);
            fixture.detectChanges();
            expect(component.imageCropper.cropperOptions.aspectRatio).toEqual(component.aspectRatio);
            expect(component.imageCropper.cropperOptions.viewMode).toEqual(component.viewMode);
        });

        it('should get correct loadError and loadingDone when onError', () => {
            component.imageCropper.onError({} as Event);
            fixture.detectChanges();

            expect(component.imageCropper.loadError).toEqual(true);
            expect(component.imageCropper.loadingDone).toEqual(true);
        });

        it('should call cropDataChange when crop', (done: any) => {
            const canvas = document.createElement('canvas');
            const cropDataChangeSpy = spyOn(component, 'cropDataChange');
            component.imageCropper.cropper = {
                getCroppedCanvas: () => {
                    return canvas;
                }
            } as Cropper;
            component.imageCropper.crop();

            let promise = new Promise((resolve, reject) => {
                canvas.toBlob((blob) => resolve({ blob }));
            });
            promise.then((value) => {
                expect(cropDataChangeSpy).toHaveBeenCalled();
                done();
            });

            fixture.detectChanges();
        });
    });
});
