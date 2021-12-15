import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyFormModule, THY_FORM_CONFIG } from 'ngx-tethys/form';
import { ThyInputModule } from 'ngx-tethys/input';
import { SidebarComponent } from './components/sidebar/sidebar.component';

const TETHYS_MODULES = [ThyLayoutModule, ThyButtonModule, ThyMenuModule, ThyIconModule, ThyFormModule, ThyInputModule];

@NgModule({
    declarations: [SidebarComponent],
    imports: [CommonModule, FormsModule, RouterModule, ...TETHYS_MODULES],
    exports: [CommonModule, FormsModule, RouterModule, ...TETHYS_MODULES, SidebarComponent],
    providers: [
        {
            provide: THY_FORM_CONFIG,
            useValue: {
                layout: 'vertical',
                footerAlign: 'right'
            }
        }
    ]
})
export class SharedModule {}
