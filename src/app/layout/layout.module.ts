import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TethysComponentsModule } from '@tethys/pro';
import { SharedModule } from '../shared';
import { BasicLayoutComponent } from './basic/basic.component';

@NgModule({
    declarations: [BasicLayoutComponent],
    imports: [RouterModule, SharedModule, TethysComponentsModule]
})
export class LayoutModule {}
