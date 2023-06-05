import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'thy-pro-layout-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss']
})
export class ThyProLayoutBasicExampleComponent implements OnInit {
    menus = [
        {
            data: {
                title: '菜单1',
                icon: 'menu'
            }
        },
        {
            data: {
                title: '菜单2',
                icon: 'menu'
            },
            children: [
                {
                    data: {
                        title: '菜单2',
                        icon: 'menu'
                    }
                }
            ]
        }
    ];

    constructor() {}

    ngOnInit(): void {}
}
