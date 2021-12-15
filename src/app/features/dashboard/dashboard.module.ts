import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WorkplaceComponent } from './workplace/workplace.component';

@NgModule({
    declarations: [WorkplaceComponent],
    imports: [SharedModule, DashboardRoutingModule]
})
export class DashboardModule {}
