import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyAvatarModule } from 'ngx-tethys/avatar';
import { ThyProHeaderComponent } from './header/header.component';
import { ThyProLayoutComponent } from './layout.component';
import { ThyProSidebarComponent } from './sidebar/sidebar.component';
import { THY_SITE_SETTINGS_PROVIDER } from '../core';

const COMPONENTS = [ThyProHeaderComponent, ThyProLayoutComponent, ThyProSidebarComponent];

const TETHYS_MODULES = [ThyLayoutModule, ThyMenuModule, ThyIconModule, ThyActionModule, ThyAvatarModule];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [...TETHYS_MODULES, RouterModule, CommonModule],
    exports: [...COMPONENTS],
    providers: [THY_SITE_SETTINGS_PROVIDER]
})
export class ThyProLayoutModule {}
