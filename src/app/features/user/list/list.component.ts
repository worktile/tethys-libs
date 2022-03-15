import { Component, OnInit } from '@angular/core';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ThyTableRowEvent } from 'ngx-tethys/table';
import { UserAddComponent } from '../add/add.component';
import { UserEntity } from '../entities';
import { UserListStore } from './user-list.store';

@Component({
    selector: 'app-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class UserListComponent implements OnInit {
    public searchText: string = '';

    constructor(public userListStore: UserListStore, private dialog: ThyDialog) {}

    ngOnInit(): void {
        this.userListStore.fetchUsers();
    }

    onRowClick(event: ThyTableRowEvent) {
        console.log(event);
    }

    deleteUser(user: UserEntity) {}

    search() {}

    openAddUser() {
        this.dialog.open(UserAddComponent, {});
    }
}
