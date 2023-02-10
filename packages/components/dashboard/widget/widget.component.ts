import { Directive } from '@angular/core';
import { ThyWidgetItem } from '../dashboard.class';

@Directive()
export class ThyDashboardWidgetComponent {
    widget!: ThyWidgetItem;
}
