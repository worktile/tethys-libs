import { Pipe, PipeTransform } from '@angular/core';
import { ThyBoardCard, ThyBoardDragContainer, ThyBoardDragPredicateEvent } from './entities';
import { isFunction } from '@tethys/cdk';

@Pipe({
    name: 'thyBoardFunc',
    standalone: true
})
export class ThyBoardFuncPipe implements PipeTransform {
    transform(
        card: ThyBoardCard,
        fn: ((event: ThyBoardDragPredicateEvent) => boolean) | undefined,
        container: ThyBoardDragContainer
    ): boolean {
        if (isFunction(fn)) {
            return fn({ card: card, container: container });
        }
        return true;
    }
}
