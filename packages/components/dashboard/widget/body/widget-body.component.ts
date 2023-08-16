import { OnInit, Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'thy-dashboard-widget-body',
    templateUrl: './widget-body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-dashboard-widget-body' },
    standalone: true
})
export class ThyDashboardWidgetBodyComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
