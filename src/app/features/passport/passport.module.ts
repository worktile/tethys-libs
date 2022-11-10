import { NgModule } from '@angular/core';
import { LayoutModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared';
import { PassportLoginComponent } from './login/login.component';
import { PassportLogoutComponent } from './logout/logout.component';
import { PassportRoutingModule } from './passport-routing.module';

@NgModule({
    declarations: [PassportLoginComponent, PassportLogoutComponent],
    imports: [PassportRoutingModule, SharedModule, LayoutModule],
    exports: [],
    providers: []
})
export class PassportModule {}
