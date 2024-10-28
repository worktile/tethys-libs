import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane, ThyBoardSortEvent } from './entities';
import { EMPTY_OBJECT_ID_STR } from './constants';
import { helpers } from 'ngx-tethys/util';
import { produce } from '@tethys/cdk';

@Injectable()
export class ThyBoardService {
    private cards: WritableSignal<ThyBoardCard[]> = signal([]);

    private entries: WritableSignal<ThyBoardEntry[]> = signal([]);

    private lanes: WritableSignal<ThyBoardLane[]> = signal([]);

    private innerAllLanesExpanded: WritableSignal<boolean> = signal(true);

    private innerEntryCollapsible: WritableSignal<boolean> = signal(false);

    private hasAutoEmptyLane: WritableSignal<boolean> = signal(true);

    private sortCardsInEntry: WritableSignal<(event: ThyBoardSortEvent) => ThyBoardCard[]> = signal(
        (event: ThyBoardSortEvent) => event.cards
    );

    private emptyLane: WritableSignal<ThyBoardLane> = signal({
        _id: EMPTY_OBJECT_ID_STR,
        name: '未分组',
        cards: []
    });

    private innerEmptyLane = computed(() => {
        const allLanesExpanded = this.innerAllLanesExpanded();
        const emptyLane = this.emptyLane();
        return {
            _id: EMPTY_OBJECT_ID_STR,
            name: '未分组',
            cards: [],
            expanded: helpers.isUndefinedOrNull(emptyLane.expanded) ? allLanesExpanded : emptyLane.expanded
        };
    });

    private innerLanes = computed(() => {
        const lanes = this.lanes();
        const allLanesExpanded = this.innerAllLanesExpanded();
        return lanes.map((lane) => {
            return {
                ...lane,
                expanded: helpers.isUndefinedOrNull(lane.expanded) ? allLanesExpanded : lane.expanded
            };
        });
    });

    public lanesWithEntriesAndCards: Signal<ThyBoardLane[]> = computed(() => {
        const entries = this.entries();
        const cards = this.cards();
        const lanes = this.innerLanes();
        const innerEmptyLane = this.innerEmptyLane();

        return this.buildLanesWithEntriesAndCards(lanes, entries, cards, innerEmptyLane);
    });

    public entriesWithCards: Signal<ThyBoardEntry[]> = computed(() => {
        const lanesWithEntriesAndCards = this.lanesWithEntriesAndCards();
        const entries = this.entries();
        return this.buildEntriesWithCardsByLanes(lanesWithEntriesAndCards, entries);
    });

    public entryCollapsible = computed(() => {
        const entryCollapsible = this.innerEntryCollapsible();
        const lanes = this.innerLanes();
        if (entryCollapsible) {
            return lanes.length === 0 || lanes.every((lane) => lane.expanded);
        } else {
            return false;
        }
    });

    public hasCollapsedEntry = computed(() => {
        const entryCollapsible = this.innerEntryCollapsible();

        if (entryCollapsible) {
            const entries = this.entries();
            return !!entries.find((entry) => !helpers.isUndefinedOrNull(entry.expanded) && !entry.expanded);
        } else {
            return false;
        }
    });

    public laneCollapsible = computed(() => {
        const entries = this.entries();
        return entries.every((entry) => entry.expanded || helpers.isUndefinedOrNull(entry.expanded));
    });

    public allLanesExpanded = computed(() => {
        const lanes = this.lanesWithEntriesAndCards();
        const allLanesExpanded = (lanes || []).every((lane) => {
            return lane?.expanded;
        });
        return allLanesExpanded;
    });

    constructor() {}

    public setCards(cards: ThyBoardCard[]) {
        this.cards.set([...(cards || [])]);
    }

    public setEntities(entries: ThyBoardEntry[]) {
        this.entries.set([...(entries || [])]);
    }

    public setLanes(lanes: ThyBoardLane[]) {
        this.lanes.set([...(lanes || [])]);
    }

    public setAllLanesExpanded(state: boolean) {
        this.innerAllLanesExpanded.set(state);
    }

    public setInnerEntryCollapsible(state: boolean) {
        this.innerEntryCollapsible.set(state);
    }

    public setHasAutoEmptyLane(state: boolean) {
        this.hasAutoEmptyLane.set(state);
    }

    public setSortCardsInEntry(state: (event: ThyBoardSortEvent) => ThyBoardCard[]) {
        this.sortCardsInEntry.set(state);
    }

    private buildCardsMap(cards: ThyBoardCard[]): Record<string, ThyBoardCard[]> {
        const cardsMapByEntryId: Record<string, ThyBoardCard[]> = {};

        (cards || []).forEach((card) => {
            (card.entryIds || []).forEach((entryId) => {
                cardsMapByEntryId[entryId] = cardsMapByEntryId[entryId] ? cardsMapByEntryId[entryId].concat([card]) : [card];
            });
        });
        return cardsMapByEntryId;
    }

    private buildEntriesWithCards(cards: ThyBoardCard[], lane: ThyBoardLane, entries: ThyBoardEntry[]) {
        const cardsMapByEntryId = this.buildCardsMap(cards);
        const sortCardsInEntry = this.sortCardsInEntry();

        return (entries || []).map((entry) => {
            return {
                ...entry,
                expanded: !helpers.isUndefinedOrNull(entry.expanded) ? entry.expanded : true,
                cards: cardsMapByEntryId[entry._id]
                    ? sortCardsInEntry({ cards: cardsMapByEntryId[entry._id], lane: lane, entry: entry })
                    : []
            };
        });
    }

    private buildLanesWithEntriesAndCards(
        lanes: ThyBoardLane[],
        entries: ThyBoardEntry[],
        cards: ThyBoardCard[],
        innerEmptyLane: ThyBoardLane
    ) {
        const unGroup: ThyBoardLane = {
            ...innerEmptyLane,
            cards: []
        };

        const lanesMapById: Record<string, ThyBoardLane> = {};
        (lanes || []).forEach((lane) => {
            lane.cards = [];
            lanesMapById[lane._id] = lane;
        });

        (cards || []).forEach((card) => {
            const cardLanes = [];
            (card.laneIds || []).forEach((laneId) => {
                let lane = lanesMapById[laneId];
                if (lane) {
                    cardLanes.push(lane);
                    lane.cards = lane.cards?.concat(card);
                }
            });

            if (cardLanes.length === 0) {
                unGroup.cards = unGroup.cards?.concat(card);
            }
        });
        lanes = this.hasAutoEmptyLane() && unGroup.cards!.length > 0 ? [...lanes, unGroup] : [...lanes];
        return lanes.map((lane) => {
            if (!lane.cards) {
                lane.cards = [];
            }

            return {
                ...lane,
                entries: this.buildEntriesWithCards(lane.cards, lane, entries)
            };
        });
    }

    private buildEntriesWithCardsByLanes(lanes: ThyBoardLane[], entries: ThyBoardEntry[]) {
        const entriesMapById: Record<string, ThyBoardEntry> = {};
        (entries || []).forEach((entry) => {
            entriesMapById[entry._id] = { ...entry };
            entriesMapById[entry._id].cards = [];
            entriesMapById[entry._id].expanded = !helpers.isUndefinedOrNull(entry.expanded) ? entry.expanded : true;
        });
        (lanes || []).forEach((lane) => {
            lane.entries!.forEach((entry) => {
                entriesMapById[entry._id].cards = (entriesMapById[entry._id].cards || []).concat(entry.cards || []);
            });
        });

        return entries.map((entry) => {
            return entriesMapById[entry._id];
        });
    }

    public expandEntry(event: { entry: ThyBoardEntry; expanded: boolean }) {
        const entries = produce(this.entries()).update(event.entry._id, { expanded: event.expanded });
        this.entries.set([...entries]);
    }

    expandLane(event: { lane: ThyBoardLane; expanded: boolean }) {
        const isUseDefaultEmpty = event.lane._id === EMPTY_OBJECT_ID_STR && !this.lanes().find((lane) => lane._id === EMPTY_OBJECT_ID_STR);
        if (isUseDefaultEmpty) {
            this.emptyLane.set({ ...this.emptyLane(), expanded: event.expanded });
        } else {
            const lanes = produce(this.lanes()).update(event.lane._id, { expanded: event.expanded });
            this.lanes.set([...lanes]);
        }
    }

    expandAllLanes(event: boolean) {
        this.innerAllLanesExpanded.set(event);
        const lanes = this.lanes().map((lane) => {
            return { ...lane, expanded: event };
        });
        this.lanes.set(lanes);
        this.emptyLane.set({ ...this.emptyLane(), expanded: event });
    }
}
