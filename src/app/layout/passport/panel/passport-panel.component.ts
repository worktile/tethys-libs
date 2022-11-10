import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-passport-panel',
    templateUrl: './passport-panel.component.html',
    styleUrls: ['./passport-panel.component.scss']
})
export class PassportPanelLayoutComponent implements OnInit {
    @Input() heading: string = '';

    @ContentChild('description') descriptionTemplateRef!: TemplateRef<any>;

    constructor() {}

    ngOnInit() {}
}
