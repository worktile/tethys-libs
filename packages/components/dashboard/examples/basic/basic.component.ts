import { Component, OnInit, ViewChild } from '@angular/core';
import { ThyDashboardComponent } from '@tethys/pro/dashboard';
import { ThyDashboardBasicLinksWidgetComponent } from './widgets/links/links.component';
import { ThyDashboardBasicNoticeWidgetComponent } from './widgets/notice/notice.component';

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
            size: {
                cols: 5,
                rows: 3
            }
        },
        {
            _id: '63c0d6f08e1cc40c3e41ad30',
            name: '链接',
            type: 'links',
            size: {
                cols: 4,
                rows: 3
            }
        }
    ];

    widgetViews = {
        notice: ThyDashboardBasicNoticeWidgetComponent,
        links: ThyDashboardBasicLinksWidgetComponent
    };

    editing = false;

    @ViewChild('thyDashboard')
    dashboardComponent!: ThyDashboardComponent;

    constructor() {}

    ngOnInit(): void {}
}
