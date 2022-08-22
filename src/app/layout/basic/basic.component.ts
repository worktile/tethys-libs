import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalStore } from '@tethys/pro';
import { DEFAULT_GLOBAL_SETTING } from '../../config/setting';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    host: {
        class: 'thy-layout'
    }
})
export class BasicLayoutComponent implements OnInit {
    constructor(public globalConfigStore: GlobalStore) {}

    ngOnInit(): void {
        this.globalConfigStore.initializeConfig(DEFAULT_GLOBAL_SETTING);
    }
}
