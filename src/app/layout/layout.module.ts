import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TethysComponentsModule } from '@tethys/pro';
import { SharedModule } from '../shared';
import { BasicLayoutComponent } from './basic/basic.component';
import { PassportPanelLayoutComponent } from './passport/panel/passport-panel.component';
import { PassportLayoutComponent } from './passport/passport.component';

@NgModule({
    declarations: [BasicLayoutComponent, PassportLayoutComponent, PassportPanelLayoutComponent],
    imports: [RouterModule, SharedModule, TethysComponentsModule],
    exports: [PassportPanelLayoutComponent]
})
export class LayoutModule {}
