import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ThyGlobalStore, ThyTheme } from '../../../core';

@Component({
    selector: 'thy-pro-setting',
    templateUrl: './setting.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-pro-setting'
    }
})
export class ThyProSettingComponent implements OnInit {
    constructor(public globalStore: ThyGlobalStore) {}

    themes: { key: ThyTheme; name: string }[] = [
        {
            key: 'dark',
            name: '暗色'
        },
        {
            key: 'light',
            name: '亮色'
        }
    ];

    ngOnInit(): void {}

    changeTheme(theme: { key: ThyTheme; name: string }) {
        this.globalStore.pureUpdateSettings({ theme: theme.key });
    }
}
