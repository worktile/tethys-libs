import { Component, OnInit } from '@angular/core';
import { injectLocale } from '@tethys/pro/i18n';

@Component({
    selector: 'thy-pro-i18n-basic-example',
    templateUrl: 'basic.component.html'
})
export class ThyProI18nBasicExampleComponent implements OnInit {
    locale = injectLocale();

    constructor() {}

    ngOnInit() {}
}
