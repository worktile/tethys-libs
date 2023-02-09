import { Component, OnInit, ViewChild } from '@angular/core';
import { ThyProDashboardComponent } from '@tethys/pro/dashboard';

@Component({
    selector: 'thy-pro-dashboard-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss']
})
export class ThyProDashboardBasicExampleComponent implements OnInit {
    widgets = [
        {
            _id: '63c0d6f08e1cc40c3e41ad30',
            name: '版本列表',
            dashboard_id: '63c0d66f8e1cc40c3e41ad2d',
            type: 'agile_version_list',
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

    editing = false;

    @ViewChild('thyProDashboard')
    dashboardComponent!: ThyProDashboardComponent;

    constructor() {}

    ngOnInit(): void {}

    toggleManageWidget() {
        this.dashboardComponent.toggleManageWidget();
        this.editing = this.dashboardComponent.editing;
    }

    save() {
        const newWidgets = this.dashboardComponent.saveWidget();
        this.toggleManageWidget();
        console.log(newWidgets);
    }
}
