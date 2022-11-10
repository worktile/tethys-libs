import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { BasicLayoutComponent } from './basic/basic.component';
import { PassportPanelLayoutComponent } from './passport/panel/passport-panel.component';
import { PassportLayoutComponent } from './passport/passport.component';

@NgModule({
    declarations: [BasicLayoutComponent, PassportPanelLayoutComponent, PassportLayoutComponent],
    imports: [RouterModule, SharedModule],
    exports: [PassportPanelLayoutComponent, PassportLayoutComponent]
})
export class LayoutModule {}
