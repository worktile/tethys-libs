import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThyImageCropperDialogComponent, ThyImageCropperModule } from '@tethys/pro/image-cropper';
import { thyViewMode } from '../cropper.entity';

@Component({
    selector: 'thy-test-cropper-dialog-basic',
    template: `<thy-image-cropper-dialog
        [thyImage]="image"
        [thyPreviewSizes]="previewSizes"
        [thyViewMode]="viewMode"
        [thyAspectRatio]="aspectRatio"
        [thyUploadTips]="uploadTips"
        [thyConfirmAction]="confirmAction()"
    ></thy-image-cropper-dialog>`
})
export class ThyImageCropperDialogTestBasicComponent {
    @ViewChild(ThyImageCropperDialogComponent, { static: true }) public dialog!: ThyImageCropperDialogComponent;

    image: string | File = 'image.png';

    uploadTips = '(最佳尺寸 120X120 像素，可以上传高质量图片进行裁剪)';

    viewMode: thyViewMode = 1;

    aspectRatio = 1;

    previewSizes = [
        { width: 120, height: '120px' },
        { width: 38, height: '38px' }
    ];

    confirmAction = () => {};
}

describe('imageCropperComponent', () => {
    let component: ThyImageCropperDialogTestBasicComponent;
    let fixture: ComponentFixture<ThyImageCropperDialogTestBasicComponent>;
    let debugElement: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ThyImageCropperDialogTestBasicComponent],
            imports: [ThyImageCropperModule]
        }).compileComponents();
    }));

    describe('dialog', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(ThyImageCropperDialogTestBasicComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement.query(By.directive(ThyImageCropperDialogComponent));
            fixture.detectChanges();
        });

        it('should dialog component is be created', () => {
            expect(fixture).toBeTruthy();
            expect(component).toBeTruthy();
        });

        it('should get correct thyUploadTips when set thyUploadTips', () => {
            expect(component.dialog.uploadTips).toEqual(component.uploadTips);

            component.uploadTips = '自定义的提示信息';
            fixture.detectChanges();
            expect(component.dialog.uploadTips).toEqual(component.uploadTips);
        });

        it('should get correct previewSizes when set thyPreviewSizes', () => {
            let previewImageElements = debugElement.nativeElement.querySelectorAll('.preview-image-size');

            expect(previewImageElements.length).toEqual(component.previewSizes.length);
            expect(previewImageElements[0].textContent).toEqual('120X120');

            component.previewSizes = [
                { width: 120, height: '120px' },
                { width: 60, height: '60px' },
                { width: 38, height: '38px' }
            ];
            fixture.detectChanges();

            previewImageElements = debugElement.nativeElement.querySelectorAll('.preview-image-size');
            expect(previewImageElements.length).toEqual(3);
            expect(previewImageElements[1].textContent).toEqual('60X60');
        });

        it('should get default size when thyPreviewSizes is empty', () => {
            component.previewSizes = [];
            fixture.detectChanges();

            const previewImageElements = debugElement.nativeElement.querySelectorAll('.preview-image-size');
            expect(previewImageElements.length).toEqual(1);
            expect(previewImageElements[0].textContent).toEqual('120X120');
        });

        it('should call confirmAction when click save button', () => {
            const confirmSpy = spyOn(component, 'confirmAction');
            const saveButton = debugElement.nativeElement.querySelector('button.btn-primary');
            saveButton.click();
            fixture.detectChanges();

            expect(confirmSpy).toHaveBeenCalled();
        });
    });
});