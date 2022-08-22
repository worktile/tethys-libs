import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { GlobalStore } from '../../core';

@Component({
    selector: 'thy-pro-header',
    templateUrl: './header.component.html'
})
export class ThyProHeaderComponent implements OnInit {
    @Input() public headerRightContentTemplate!: TemplateRef<HTMLElement>;

    constructor(public globalConfigStore: GlobalStore) {}

    ngOnInit(): void {}
}
