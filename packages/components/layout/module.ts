import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyMenu, ThyMenuModule } from 'ngx-tethys/menu';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyAvatarModule } from 'ngx-tethys/avatar';
import { ThyProHeaderComponent } from './header/header.component';
import { ThyProLayoutComponent } from './layout.component';
import { ThyProSidebarComponent } from './sidebar/sidebar.component';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyContentMainBody, ThyContentMainHeader } from './content-main/content-main';

const COMPONENTS = [ThyProHeaderComponent, ThyProLayoutComponent, ThyProSidebarComponent, ThyContentMainHeader, ThyContentMainBody];

const TETHYS_MODULES = [
    ThyLayoutModule,
    ThyMenuModule,
    ThyIconModule,
    ThyPopoverModule,
    ThyActionModule,
    ThyAvatarModule,
    ThyTooltipModule
];

@NgModule({
    imports: [...TETHYS_MODULES, RouterModule, CommonModule, ...COMPONENTS],
    exports: [...COMPONENTS],
    providers: []
})
export class ThyProLayoutModule {}
