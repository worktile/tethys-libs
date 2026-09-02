import { Component, inject, Injector, ChangeDetectionStrategy } from '@angular/core';
import { ThyGlobalStore } from '@tethys/pro/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    host: {
        class: 'thy-layout'
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
    constructor() {
        const globalStore = inject(ThyGlobalStore);
    }
}
