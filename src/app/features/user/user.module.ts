import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './list/list.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../shared';
import { UserListStore } from './list/user-list.store';
import { UserAddComponent } from './add/add.component';

@NgModule({
    declarations: [UserAddComponent],
    imports: [CommonModule, UserRoutingModule, SharedModule],
    providers: [UserListStore]
})
export class UserModule {}
