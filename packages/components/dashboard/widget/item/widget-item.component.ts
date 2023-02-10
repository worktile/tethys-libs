import {
    OnInit,
    Component,
    Input,
    OnChanges,
    ChangeDetectionStrategy,
    SimpleChanges,
    ComponentRef,
    ViewChild,
    ViewContainerRef,
    Type
} from '@angular/core';
import { InputBoolean } from 'ngx-tethys/core';
import { ThyWidgetItem } from '../../dashboard.class';

@Component({
    selector: 'thy-dashboard-widget-item',
    templateUrl: './widget-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-dashboard-widget-item' }
})
export class ThyDashboardWidgetItemComponent implements OnInit, OnChanges {
    @Input() @InputBoolean() editing = false;

    @Input() widget!: ThyWidgetItem;

    @Input() component!: Type<any>;

    @ViewChild('container', { static: true, read: ViewContainerRef }) componentContainer!: ViewContainerRef;

    widgetComponentRef!: ComponentRef<any>;

    constructor() {}

    ngOnInit() {
        this.loadWidgetComponent();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.widgetComponentRef) {
            if (changes.editing) {
                this.widgetComponentRef.instance.editing = this.editing;
            }
            if (changes.widget) {
                this.widgetComponentRef.instance.widget = this.widget;
            }
        }
    }

    private clearWidgetComponent() {
        if (this.componentContainer) {
            this.componentContainer.clear();
        }
    }

    private loadWidgetComponent() {
        this.clearWidgetComponent();
        if (this.component) {
            this.widgetComponentRef = this.componentContainer.createComponent(this.component);
            this.widgetComponentRef.instance.widget = this.widget;
            this.widgetComponentRef.instance.editing = this.editing;
        }
    }
}
