import { asyncBehavior } from '@tethys/cdk/behaviors';
import { Component, inject, OnInit } from '@angular/core';
import { TodosStore } from './todos.store';
import { SharedModule } from '../../shared';
import { ThyContentDirective } from 'ngx-tethys/layout';

@Component({
    selector: 'app-todos',
    templateUrl: './todos.component.html',
    imports: [SharedModule],
    providers: [TodosStore],
    hostDirectives: [ThyContentDirective],
    standalone: true
})
export class AppTodosComponent implements OnInit {
    protected todosStore = inject(TodosStore);

    protected searchText: string = '';

    fetchTodos = asyncBehavior(() => this.todosStore.fetchTodos());

    constructor() {}

    ngOnInit(): void {
        this.fetchTodos.execute();
    }

    search() {}

    onRowClick($event: any) {}
}
