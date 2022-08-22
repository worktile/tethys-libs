import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxTethysModule } from '../tethys/module';
import { ThyProHeaderComponent } from './header/header.component';
import { ThyProLayoutComponent } from './layout.component';
import { ThyProSidebarComponent } from './sidebar/sidebar.component';

const COMPONENTS = [ThyProHeaderComponent, ThyProLayoutComponent, ThyProSidebarComponent];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [NgxTethysModule, RouterModule, CommonModule],
    exports: [...COMPONENTS]
})
export class ThyProLayoutModule {}
