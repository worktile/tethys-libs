import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyProSettingComponent } from './header/setting/setting.component';
import { ThySlideModule, ThySlideService } from 'ngx-tethys/slide';
import { ThyFormModule } from 'ngx-tethys/form';

const COMPONENTS = [ThyProHeaderComponent, ThyProLayoutComponent, ThyProSidebarComponent, ThyProSettingComponent];

const TETHYS_MODULES = [
    ThyLayoutModule,
    ThyMenuModule,
    ThyIconModule,
    ThyPopoverModule,
    ThyActionModule,
    ThyAvatarModule,
    ThyTooltipModule,
    ThyDropdownModule,
    ThySlideModule,
    ThyFormModule
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [...TETHYS_MODULES, RouterModule, CommonModule, FormsModule],
    exports: [...COMPONENTS],
    providers: [THY_SITE_SETTINGS_PROVIDER, ThySlideService]
})
export class ThyProLayoutModule {}
