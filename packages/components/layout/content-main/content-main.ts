import { Component, OnInit, viewChild, contentChild, input, TemplateRef } from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'thy-pro-content-main-header',
    template: `
        <div class="header-body">
            @if (searchTemplateRef() || viewTemplateRef() || operationTemplateRef()) {
                <div class="header-content">
                    @if (searchTemplateRef()) {
                        <ng-template [ngTemplateOutlet]="searchTemplateRef()!"></ng-template>
                    }

                    @if (viewTemplateRef()) {
                        <div class="header-content-view">
                            <ng-template [ngTemplateOutlet]="viewTemplateRef()!"></ng-template>
                        </div>
                    }
                    @if (thyCount() !== undefined) {
                        <div class="header-content-info">
                            <span class="text-secondary">{{ thyCount() }}</span
                            ><span class="text-muted ml-1">{{ thyCountUnitName() }}</span>
                        </div>
                    }
                    @if (operationTemplateRef()) {
                        <div class="header-content-operation d-flex justify-content-end">
                            <ng-template [ngTemplateOutlet]="operationTemplateRef()!"></ng-template>
                        </div>
                    }
                </div>
            } @else {
                <ng-content></ng-content>
            }
        </div>
    `,
    host: {
        class: 'thy-pro-content-main-header'
    },
    imports: [NgTemplateOutlet]
})
export class ThyContentMainHeader implements OnInit {
    protected searchTemplateRef = contentChild<TemplateRef<any>>('headerSearch');

    protected viewTemplateRef = contentChild<TemplateRef<any>>('headerView');

    protected operationTemplateRef = contentChild<TemplateRef<any>>('headerOperation');

    thyCount = input<number>();

    thyCountUnitName = input<string>();

    constructor() {}

    ngOnInit(): void {}
}

@Component({
    selector: 'thy-pro-content-main-body',
    template: '<ng-content></ng-content>',
    host: {
        class: 'thy-pro-content-main-body'
    },
    standalone: true
})
export class ThyContentMainBody implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
