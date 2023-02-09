import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { ThyDashboardWidget } from '../../widget/widget.class';
import { ThyDashboardWidgetItemComponent } from '../../widget/widget.component';

@Component({
    selector: 'thy-pro-layout-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss']
})
export class ThyProLayoutBasicExampleComponent implements OnInit {
    widgets: ThyDashboardWidget[] = [];

    widgetComponents: Record<string, ComponentType<ThyDashboardWidgetItemComponent>> = {
        ['text']: ThyDashboardWidgetItemComponent
    };

    constructor() {}

    ngOnInit(): void {}

    widgetsChange(widgets: ThyDashboardWidget[]) {}
}
