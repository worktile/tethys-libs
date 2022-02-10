import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { BasicLayoutComponent } from './basic/basic.component';

@NgModule({
    declarations: [BasicLayoutComponent],
    imports: [RouterModule, SharedModule]
})
export class LayoutModule {}
