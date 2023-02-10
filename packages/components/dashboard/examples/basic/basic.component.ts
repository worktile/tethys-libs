import { Component, OnInit, ViewChild } from '@angular/core';
import { ThyDashboardComponent } from '@tethys/pro/dashboard';
import { ThyDashboardBasicNoticeWidgetComponent } from './widgets/notice.component';

@Component({
    selector: 'thy-dashboard-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss']
})
export class ThyDashboardBasicExampleComponent implements OnInit {
    widgets = [
        {
            _id: '63c0d6f08e1cc40c3e41ad30',
            name: '公告',
            type: 'notice',
            position: {
                x: 0,
                y: 0
            },
            size: {
                cols: 9,
                rows: 3
            }
        }
    ];

    widgetComponents = {
        notice: ThyDashboardBasicNoticeWidgetComponent
    };

    editing = false;

    @ViewChild('thyDashboard')
    dashboardComponent!: ThyDashboardComponent;

    constructor() {}

    ngOnInit(): void {}
}
