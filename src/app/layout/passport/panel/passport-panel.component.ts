import { Component, ContentChild, input, OnInit, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-passport-panel',
    templateUrl: './passport-panel.component.html',
    styleUrls: ['./passport-panel.component.scss'],
    standalone: false
})
export class PassportPanelLayoutComponent implements OnInit {
    readonly heading = input<string>('');

    @ContentChild('description') descriptionTemplateRef!: TemplateRef<any>;

    constructor() {}

    ngOnInit() {}
}
