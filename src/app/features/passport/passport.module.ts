import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { LoginComponent } from './login/login.component';
import { PassportRoutingModule } from './passport-routing.module';

@NgModule({
    declarations: [LoginComponent],
    imports: [PassportRoutingModule, SharedModule],
    exports: [],
    providers: []
})
export class PassportModule {}
