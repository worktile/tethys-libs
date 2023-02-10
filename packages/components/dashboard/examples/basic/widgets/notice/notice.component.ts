import { Component, OnInit } from '@angular/core';
import { ThyDashboardWidgetComponent, ThyWidgetItem } from '@tethys/pro/dashboard';

@Component({
    selector: 'thy-dashboard-basic-notice-widget',
    templateUrl: './notice.component.html'
})
export class ThyDashboardBasicNoticeWidgetComponent extends ThyDashboardWidgetComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {}
}
