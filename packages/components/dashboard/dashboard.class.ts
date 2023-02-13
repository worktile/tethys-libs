import { GridsterConfig, GridsterItem } from 'angular-gridster2';

export interface WidgetGridsterItem extends GridsterItem {
    widget: ThyWidgetItem;
}

export interface ThyWidgetItem<TConfig = unknown> {
    type: string;
    size: { cols: number; rows: number };
    position: { x: number; y: number };
    name?: string;
    _id?: string;
    config?: TConfig;
}

export interface ThyDashboardConfig extends GridsterConfig {}
