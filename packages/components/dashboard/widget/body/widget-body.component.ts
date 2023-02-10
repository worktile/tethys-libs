import { OnInit, Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { WidgetInfo } from '../../dashboard.class';

@Component({
    selector: 'thy-dashboard-widget-body',
    templateUrl: './widget-body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-dashboard-widget-body' }
})
export class ThyDashboardWidgetBodyComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
