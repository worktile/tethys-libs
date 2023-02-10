import { Directive } from '@angular/core';
import { ThyWidgetItem } from '@tethys/pro/dashboard';

@Directive()
export class ThyDashboardWidgetComponent {
    widget!: ThyWidgetItem;
}
