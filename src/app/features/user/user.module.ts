import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './list/list.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../shared';
import { UserListStore } from './list/user-list.store';
import { UserAddComponent } from './add/add.component';

@NgModule({
    declarations: [UserListComponent, UserAddComponent],
    imports: [CommonModule, UserRoutingModule, SharedModule],
    entryComponents: [UserAddComponent],
    providers: [UserListStore]
})
export class UserModule {}
