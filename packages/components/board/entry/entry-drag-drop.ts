import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Directive, ChangeDetectorRef, effect, viewChildren, inject, viewChild } from '@angular/core';
import { SafeAny } from 'ngx-tethys/types';
import { ThyBoardCard, ThyBoardDragContainer } from '../entities';
import { CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, DropListRef, transferArrayItem } from '@angular/cdk/drag-drop';
import { tap } from 'rxjs';
import { ThyBoardEntryAbstract } from '../entities';

@Directive()
export abstract class ThyBoardEntryDragDrop {
    currentViewport = viewChild(CdkVirtualScrollViewport);

    cdkDropLists = viewChildren(CdkDropList);

    public changeDetectorRef = inject(ChangeDetectorRef);

    private preDraggingCard: CdkDrag<ThyBoardCard> | undefined;

    private preCdkDropLists: CdkDropList[] = [];

    constructor(public boardEntry: ThyBoardEntryAbstract) {
        effect(() => {
            if (this.boardEntry.sortable() || this.boardEntry.movable()) {
                const draggingCard = this.boardEntry.draggingCard();
                const cdkDropLists = this.cdkDropLists();
                if (draggingCard && cdkDropLists?.length > 0 && this.preCdkDropLists.length < cdkDropLists.length) {
                    const siblings: CdkDropList<any>[] = [];
                    const group = draggingCard.dropContainer['_group'];
                    if (group) {
                        group._items.forEach((drop: any) => {
                            if (siblings.indexOf(drop) === -1) {
                                siblings.push(drop);
                            }
                        });
                    }

                    const refs = siblings
                        .filter((drop) => drop && drop !== draggingCard.dropContainer)
                        .map((list) => list._dropListRef)
                        .filter((ref) => {
                            const index = draggingCard.dropContainer._dropListRef['_siblings'].indexOf((sibling: DropListRef) => {
                                return sibling === ref;
                            });
                            return index < 0;
                        });
                    if (refs.length > 0) {
                        draggingCard.dropContainer._dropListRef.connectedTo([
                            ...draggingCard.dropContainer._dropListRef['_siblings'],
                            ...refs
                        ]);
                        (draggingCard.dropContainer._dropListRef['_notifyReceivingSiblings'] as any)();
                        this.preDraggingCard = draggingCard;
                        this.preCdkDropLists = [...cdkDropLists];
                    }
                }
                if (!draggingCard && this.preDraggingCard) {
                    this.preDraggingCard?.dropContainer._dropListRef['_reset']();
                    this.preDraggingCard = draggingCard;
                    this.preCdkDropLists = [];
                }
            }
        });
    }

    cdkDragStarted(event: CdkDragStart) {
        this.boardEntry.cardDragStarted.emit(event.source);
    }

    dragReleased(): void {}

    checkCardDroppable(drag: CdkDrag<ThyBoardCard>, container: ThyBoardDragContainer): boolean {
        return false;
    }

    private checkCardDropInLaneAndEntry(card: CdkDrag<ThyBoardCard>, container: ThyBoardDragContainer): boolean {
        if (this.boardEntry.sortable() || this.boardEntry.movable()) {
            return this.checkCardDroppable(card, container);
        }
        return false;
    }

    dropListEnterPredicate = (drag: CdkDrag<ThyBoardCard>, drop: CdkDropList<ThyBoardDragContainer>) => {
        const container: ThyBoardDragContainer = {
            entry: drop.data.entry,
            lane: drop.data.lane,
            cards: drop.data.cards,
            status: drop.data.status,
            zone: drop.data.zone
        };
        if (!this.checkCardDropInLaneAndEntry(drag, container)) {
            return false;
        } else {
            const cardDropEnterPredicate = this.boardEntry.cardDropEnterPredicate();
            if (cardDropEnterPredicate) {
                return cardDropEnterPredicate({
                    card: drag.data,
                    container: container
                });
            } else {
                return false;
            }
        }
    };

    drop(event: CdkDragDrop<ThyBoardDragContainer | SafeAny>) {
        const previousIndex = (event.previousContainer.data?.cards || []).findIndex(
            (card: ThyBoardCard) => card._id === event.item.data._id
        );
        const currentIndex = (event.container.data?.cards || []).findIndex((card: ThyBoardCard) => card._id === event.item.data._id);
        transferArrayItem(event.previousContainer.data?.cards!, event.container.data?.cards!, previousIndex, currentIndex);
        const cardDropAction = this.boardEntry.cardDropAction();
        if (cardDropAction) {
            cardDropAction({
                card: event.item.data,
                previousContainer: event.previousContainer.data!,
                previousIndex: event.previousIndex,
                container: event.container.data!,
                currentIndex: event.currentIndex
            })
                .pipe(
                    tap((result: boolean) => {
                        if (!result) {
                            transferArrayItem(
                                event.container.data?.cards!,
                                event.previousContainer.data?.cards!,
                                currentIndex,
                                previousIndex
                            );
                            event.previousContainer.data.changeDetectorRef.markForCheck();
                            this.changeDetectorRef.markForCheck();
                        }
                    })
                )
                .subscribe();
        }
    }
}
