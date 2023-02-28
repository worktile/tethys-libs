import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyLoadingModule } from 'ngx-tethys/loading';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyUploadModule } from 'ngx-tethys/upload';
import { ThyCropperComponent } from './cropper.component';
import { ThyCropperSizeStylePipe, ThyCropperSizeTextPipe } from './cropper.pipe';
import { ThyCropperDialogComponent } from './dialog/dialog.component';

@NgModule({
    declarations: [ThyCropperComponent, ThyCropperDialogComponent, ThyCropperSizeTextPipe, ThyCropperSizeStylePipe],
    imports: [CommonModule, ThyLoadingModule, ThyUploadModule, ThyButtonModule, ThyDialogModule, ThyNotifyModule],
    exports: [ThyCropperComponent, ThyCropperDialogComponent],
    providers: []
})
export class ThyProCropperModule {}
