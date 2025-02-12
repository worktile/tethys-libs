import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EntityStore, EntityState, Action } from '@tethys/store';
import { tap } from 'rxjs';

export interface TodoModel {
    id: string;
    title: string;
    completed: boolean;
}

export interface TodosStoreState extends EntityState<TodoModel> {}

@Injectable()
export class TodosStore extends EntityStore<TodosStoreState, TodoModel> {
    private http = inject(HttpClient);

    constructor() {
        super({});
    }

    @Action()
    fetchTodos() {
        return this.http.get('https://jsonplaceholder.typicode.com/todos').pipe(
            tap((data) => {
                this.update({
                    entities: data as TodoModel[]
                });
            })
        );
    }
}
