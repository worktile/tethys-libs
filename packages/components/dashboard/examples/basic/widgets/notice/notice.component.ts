import { Component, OnInit } from '@angular/core';
import { ThyDashboardWidgetComponent } from '@tethys/pro/dashboard';

@Component({
    selector: 'thy-dashboard-basic-notice-widget',
    templateUrl: './notice.component.html',
    standalone: false
})
export class ThyDashboardBasicNoticeWidgetComponent extends ThyDashboardWidgetComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {}
}
