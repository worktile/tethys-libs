import { OnInit, Component, TemplateRef, ChangeDetectionStrategy, input, contentChild } from '@angular/core';
import { ThySharedModule } from 'ngx-tethys/shared';
import { NgClass } from '@angular/common';

@Component({
    selector: 'thy-dashboard-widget-header',
    templateUrl: './widget-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-dashboard-widget-header' },
    imports: [NgClass, ThySharedModule]
})
export class ThyDashboardWidgetHeaderComponent implements OnInit {
    readonly thyTitle = input.required<string | TemplateRef<any>>();

    readonly thyDescription = input.required<string | TemplateRef<any>>();

    readonly operationTemplateRef = contentChild.required<TemplateRef<any>>('operation');

    constructor() {}

    ngOnInit() {}
}
