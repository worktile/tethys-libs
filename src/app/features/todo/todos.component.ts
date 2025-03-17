import { asyncBehavior } from '@tethys/cdk/behaviors';
import { Component, inject, OnInit } from '@angular/core';
import { TodoModel, TodosStore } from './todos.store';
import { SharedModule } from '../../shared';
import { ThyContentDirective } from 'ngx-tethys/layout';
import { ThyContentMainHeader, ThyContentMainBody } from '@tethys/pro/layout';
import { Router } from '@angular/router';

@Component({
    selector: 'app-todos',
    templateUrl: './todos.component.html',
    imports: [SharedModule, ThyContentMainHeader, ThyContentMainBody],
    hostDirectives: [ThyContentDirective]
})
export class AppTodosComponent implements OnInit {
    protected todosStore = inject(TodosStore);

    protected router = inject(Router);

    protected searchText: string = '';

    fetchTodos = asyncBehavior(() => this.todosStore.fetchTodos());

    constructor() {}

    ngOnInit(): void {
        this.fetchTodos.execute();
        debugger;
    }

    search() {}

    onRowClick({ row }: { row: TodoModel }) {
        debugger;
        this.router.navigateByUrl(`/todos/${row.id}`);
    }
}
