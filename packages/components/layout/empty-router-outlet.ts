import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThyLayoutDirective } from 'ngx-tethys/layout';

@Component({
    selector: 'thy-layout-empty-router-outlet',
    template: `<router-outlet></router-outlet>`,
    imports: [RouterOutlet],
    hostDirectives: [ThyLayoutDirective]
})
export class ThyLayoutEmptyRouterOutlet {}
