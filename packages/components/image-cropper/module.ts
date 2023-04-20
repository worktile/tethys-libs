import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyLoadingModule } from 'ngx-tethys/loading';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThySliderModule } from 'ngx-tethys/slider';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyUploadModule } from 'ngx-tethys/upload';
import { ThyImageCropperComponent } from './cropper.component';
import { ThyCropperSizeStylePipe, ThyCropperSizeTextPipe } from './cropper.pipe';
import { ThyImageCropperDialogComponent } from './dialog.component';

@NgModule({
    declarations: [ThyImageCropperComponent, ThyImageCropperDialogComponent, ThyCropperSizeTextPipe, ThyCropperSizeStylePipe],
    imports: [
        CommonModule,
        FormsModule,
        ThyLoadingModule,
        ThyUploadModule,
        ThyButtonModule,
        ThyDialogModule,
        ThyNotifyModule,
        ThySliderModule,
        ThyIconModule,
        ThyTooltipModule
    ],
    exports: [ThyImageCropperComponent, ThyImageCropperDialogComponent],
    providers: []
})
export class ThyImageCropperModule {}
