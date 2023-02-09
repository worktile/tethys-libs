import { of } from 'rxjs';
import {
    OnInit,
    Component,
    HostBinding,
    Input,
    ContentChild,
    TemplateRef,
    ChangeDetectionStrategy,
    Output,
    EventEmitter
} from '@angular/core';
import { WidgetInfo } from '../../dashboard.entity';
import { InputBoolean } from 'ngx-tethys/core';

@Component({
    selector: 'thy-pro-widget-header',
    templateUrl: './widget-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'thy-pro-widget-header' }
})
export class ThyProWidgetHeaderComponent implements OnInit {
    @Input() widget!: WidgetInfo;

    @Input() @InputBoolean() editing = false;

    /**
     *  header 更多按钮点击事件
     */
    @Output() moreActionClick: EventEmitter<Event> = new EventEmitter();

    @ContentChild('description') descriptionTemplate!: TemplateRef<any>;

    constructor() {}

    ngOnInit() {}

    openMoreMenu() {
        this.moreActionClick.emit();
    }
}
