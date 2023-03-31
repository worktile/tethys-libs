import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyLoadingModule } from 'ngx-tethys/loading';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyUploadModule } from 'ngx-tethys/upload';
import { ThyImageCropperComponent } from './cropper.component';
import { ThyCropperSizeStylePipe, ThyCropperSizeTextPipe } from './cropper.pipe';
import { ThyImageCropperDialogComponent } from './dialog.component';

@NgModule({
    declarations: [ThyImageCropperComponent, ThyImageCropperDialogComponent, ThyCropperSizeTextPipe, ThyCropperSizeStylePipe],
    imports: [CommonModule, ThyLoadingModule, ThyUploadModule, ThyButtonModule, ThyDialogModule, ThyNotifyModule],
    exports: [ThyImageCropperComponent, ThyImageCropperDialogComponent],
    providers: []
})
export class ThyImageCropperModule {}
