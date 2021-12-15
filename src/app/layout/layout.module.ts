import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [HomeComponent],
    imports: [RouterModule, SharedModule]
})
export class LayoutModule {}
