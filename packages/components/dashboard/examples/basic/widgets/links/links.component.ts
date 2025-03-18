import { Component, OnInit } from '@angular/core';
import { ThyDashboardWidgetComponent } from '@tethys/pro/dashboard';

@Component({
    selector: 'thy-dashboard-basic-links-widget',
    templateUrl: './links.component.html',
    standalone: false
})
export class ThyDashboardBasicLinksWidgetComponent extends ThyDashboardWidgetComponent implements OnInit {
    config = null;

    constructor() {
        super();
    }

    ngOnInit() {}
}
