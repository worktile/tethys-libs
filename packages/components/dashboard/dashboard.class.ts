import { GridsterConfig, GridsterItem } from 'angular-gridster2';

export interface WidgetGridsterItem extends GridsterItem {
    widget: ThyWidgetItem;
}

export interface ThyWidgetItem<TConfig = unknown> {
    _id: string;
    type: string;
    name?: string;
    size: { cols: number; rows: number };
    position: { x: number; y: number };
    dashboard_id?: string;
    config?: TConfig;
}

export interface ThyDashboardConfig extends GridsterConfig {}
