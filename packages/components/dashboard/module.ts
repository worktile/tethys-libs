import { ThyActionModule } from 'ngx-tethys/action';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GridsterModule } from 'angular-gridster2';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyProDashboardComponent } from './dashboard.component';
import { ThyProWidgetHeaderComponent } from './widget/header/widget-header.component';
import { ThyProWidgetBodyComponent } from './widget/body/widget-body.component';
import { ThyProWidgetItemComponent } from './widget/item/widget-item.component';

const COMPONENTS = [ThyProDashboardComponent, ThyProWidgetHeaderComponent, ThyProWidgetBodyComponent, ThyProWidgetItemComponent];

const TETHYS_MODULES = [ThyTooltipModule, ThyIconModule, ThyActionModule];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [...TETHYS_MODULES, RouterModule, CommonModule, GridsterModule],
    exports: [...COMPONENTS],
    providers: []
})
export class ThyProDashboardModule {}
