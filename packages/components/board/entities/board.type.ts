export const ThyBoardDragScopeType = {
    entries: 'entries',
    lanes: 'lanes',
    all: 'all'
} as const;

export type ThyBoardDragScopeType = (typeof ThyBoardDragScopeType)[keyof typeof ThyBoardDragScopeType];
