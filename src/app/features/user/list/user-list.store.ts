import { Injectable } from '@angular/core';
import { EntityStore, EntityState, Action } from '@tethys/store';
import { of, tap } from 'rxjs';
import { UserEntity } from '../entities';
import { USERS } from './mock-users';

export interface UserListState extends EntityState<Partial<UserEntity>> {}

@Injectable()
export class UserListStore extends EntityStore<UserListState, Partial<UserEntity>> {
    constructor() {
        super({ entities: [] }, {});
    }

    @Action()
    fetchUsers() {
        return of(USERS).pipe(
            tap((data) => {
                this.initialize(data, { pageIndex: 1, count: 200, pageSize: 20 });
            })
        );
    }
}
