import { OnInit, Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { WidgetInfo } from '../../dashboard.entity';

@Component({
    selector: 'thy-pro-widget-body',
    templateUrl: './widget-body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-pro-widget-body' }
})
export class ThyProWidgetBodyComponent implements OnInit {
    @Input() widget!: WidgetInfo;

    @Input() loadingDone = true;

    constructor() {}

    ngOnInit() {}
}
