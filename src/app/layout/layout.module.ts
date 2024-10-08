import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { BasicLayoutComponent } from './basic/basic.component';
import { PassportPanelLayoutComponent } from './passport/panel/passport-panel.component';
import { PassportLayoutComponent } from './passport/passport.component';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';

@NgModule({
    declarations: [BasicLayoutComponent, PassportPanelLayoutComponent, PassportLayoutComponent, ThemeSelectorComponent],
    imports: [RouterModule, SharedModule],
    exports: [PassportPanelLayoutComponent, PassportLayoutComponent]
})
export class LayoutModule {}
