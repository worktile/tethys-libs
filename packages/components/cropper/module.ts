import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyLoadingModule } from 'ngx-tethys/loading';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyUploadModule } from 'ngx-tethys/upload';
import { ThyCropperComponent } from './cropper.component';
import { ThyProCropperPreviewComponent } from './preview/preview.component';

@NgModule({
    declarations: [ThyCropperComponent, ThyProCropperPreviewComponent],
    imports: [CommonModule, ThyLoadingModule, ThyUploadModule, ThyButtonModule, ThyDialogModule, ThyNotifyModule],
    exports: [ThyCropperComponent, ThyProCropperPreviewComponent],
    providers: []
})
export class ThyProCropperModule {}
