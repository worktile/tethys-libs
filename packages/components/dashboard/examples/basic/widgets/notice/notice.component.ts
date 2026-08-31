import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ThyDashboardWidgetComponent } from '@tethys/pro/dashboard';

@Component({
    selector: 'thy-dashboard-basic-notice-widget',
    templateUrl: './notice.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ThyDashboardBasicNoticeWidgetComponent extends ThyDashboardWidgetComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {}
}
