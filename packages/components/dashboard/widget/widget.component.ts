import { SafeAny } from 'ngx-tethys/types';
import { Directive } from '@angular/core';
import { ThyWidgetItem } from '../dashboard.class';

@Directive()
export class ThyDashboardWidgetComponent<T = SafeAny> {
    set widget(value: ThyWidgetItem<T>) {
        this._widget = value;
    }
    get widget() {
        return this._widget;
    }

    private _widget!: ThyWidgetItem<T>;
}
