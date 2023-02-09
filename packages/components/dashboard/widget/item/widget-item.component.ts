import { OnInit, Component, Input, OnChanges, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { InputBoolean } from 'ngx-tethys/core';

@Component({
    selector: 'thy-pro-widget-item',
    templateUrl: './widget-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-pro-widget-item' }
})
export class ThyProWidgetItemComponent implements OnInit, OnChanges {
    @Input() @InputBoolean() editing = false;

    // @Input() widget!: WidgetInfo;

    // @Input() isFullscreen: boolean;

    // @ViewChild('widget') widgetComponent!: ViewContainerRef;

    // widgetComponentRef: ComponentRef<any>;

    // constructor(private util: UtilService, private componentFactoryResolver: ComponentFactoryResolver) {}

    ngOnInit() {
        // this.loadWidgetComponent();
    }

    ngOnChanges(changes: SimpleChanges) {
        // if (this.widgetComponentRef) {
        //     if (changes.editing) {
        //         this.widgetComponentRef.instance.editing = this.editing;
        //     }
        //     if (changes.widget) {
        //         this.widgetComponentRef.instance.widget = this.widget;
        //     }
        // }
    }

    // private clearWidgetComponent() {
    //     if (this.widgetComponent) {
    //         this.widgetComponent.clear();
    //     }
    // }

    // private loadWidgetComponent() {
    //     this.clearWidgetComponent();
    //     const widgetConfig = widgetConfigsMap[this.widget.type];
    //     if (widgetConfig) {
    //         const widgetComponentFactory = this.componentFactoryResolver.resolveComponentFactory<any>(widgetConfig.itemComponent);
    //         this.widgetComponentRef = this.widgetComponent.createComponent(widgetComponentFactory);
    //         this.widgetComponentRef.instance.widget = this.widget;
    //         this.widgetComponentRef.instance.editing = this.editing;
    //         this.widgetComponentRef.instance.isFullscreen = this.isFullscreen;
    //     }
    // }
}
