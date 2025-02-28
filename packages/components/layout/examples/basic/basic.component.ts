import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'thy-pro-layout-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss']
})
export class ThyProLayoutBasicExampleComponent implements OnInit {
    menus = [
        {
            title: '菜单1',
            icon: 'menu'
        },
        {
            title: '菜单2',
            icon: 'menu',
            children: [
                {
                    title: '菜单2',
                    icon: 'menu'
                }
            ]
        }
    ];

    constructor() {}

    ngOnInit(): void {}
}
