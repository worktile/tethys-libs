import { ThySharedModule } from 'ngx-tethys/shared';
import { ThyActionModule } from 'ngx-tethys/action';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GridsterModule } from 'angular-gridster2';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyDashboardWidgetHeaderComponent } from './widget/header/widget-header.component';
import { ThyDashboardWidgetBodyComponent } from './widget/body/widget-body.component';
import { ThyDashboardComponent } from './dashboard.component';

const TETHYS_MODULES = [ThyTooltipModule, ThyIconModule, ThyActionModule, ThySharedModule];

@NgModule({
    declarations: [ThyDashboardComponent, ThyDashboardWidgetHeaderComponent, ThyDashboardWidgetBodyComponent],
    imports: [...TETHYS_MODULES, RouterModule, CommonModule, GridsterModule],
    exports: [ThyDashboardComponent, ThyDashboardWidgetHeaderComponent, ThyDashboardWidgetBodyComponent],
    providers: []
})
export class ThyProDashboardModule {}
