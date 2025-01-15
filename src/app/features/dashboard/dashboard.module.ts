import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WorkplaceComponent } from './workplace/workplace.component';
import { InsightComponent } from './insight/insight.component';

@NgModule({
    declarations: [],
    imports: [SharedModule, DashboardRoutingModule]
})
export class DashboardModule {}
