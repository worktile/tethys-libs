import { Component, OnInit } from '@angular/core';
import { ThyDashboardWidgetComponent, ThyWidgetItem } from '@tethys/pro/dashboard';

@Component({
    selector: 'thy-dashboard-basic-links-widget',
    templateUrl: './links.component.html'
})
export class ThyDashboardBasicLinksWidgetComponent extends ThyDashboardWidgetComponent implements OnInit {
    config = null;

    constructor() {
        super();
    }

    ngOnInit() {}
}
