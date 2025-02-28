import { Component, OnInit } from '@angular/core';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ThyTableRowEvent } from 'ngx-tethys/table';
import { UserAddComponent } from '../add/add.component';
import { UserEntity } from '../entities';
import { UserListStore } from './user-list.store';
import { ThyContentDirective } from 'ngx-tethys/layout';
import { SharedModule } from '../../../shared';
import { ThyContentMainHeader, ThyContentMainBody } from '@tethys/pro/layout';

@Component({
    selector: 'app-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: true,
    imports: [SharedModule, ThyContentMainHeader, ThyContentMainBody],
    hostDirectives: [ThyContentDirective]
})
export class UserListComponent implements OnInit {
    public searchText: string = '';

    constructor(
        public userListStore: UserListStore,
        private dialog: ThyDialog
    ) {}

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
