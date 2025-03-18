import { Component, effect, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThyContentDirective } from 'ngx-tethys/layout';
import { SharedModule } from '../../../shared';
import { TodosStore } from '../todos.store';

@Component({
    selector: 'app-todo-detail',
    templateUrl: './todo.component.html',
    hostDirectives: [ThyContentDirective],
    imports: [SharedModule]
})
export class AppTodoComponent implements OnInit {
    protected todosStore = inject(TodosStore);

    protected route = inject(ActivatedRoute);

    protected id = input.required<string>({
        transform: ((value: string) => {
            return +value;
        }) as any
    });

    constructor() {
        effect(
            () => {
                const id = this.id();
                this.todosStore.setActive(id);
            },
            { allowSignalWrites: true }
        );
    }

    ngOnInit(): void {}
}
