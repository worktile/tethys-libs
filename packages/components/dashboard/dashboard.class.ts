import { GridsterConfig, GridsterItem } from 'angular-gridster2';

export interface WidgetInfo {
    _id?: string;
    type?: string;
    name?: string;
    size: { cols: number; rows: number };
    position: { x: number; y: number };
    dashboard_id?: string;
    description?: string;
    // config?: T;
    created_by?: string;
}

export interface WidgetGridsterItem extends GridsterItem {
    widget: WidgetInfo;
}

export interface ThyWidget<TConfig = unknown> {
    _id: string;
    type: string;
    name?: string;
    size: { cols: number; rows: number };
    position: { x: number; y: number };
    dashboard_id?: string;
    config?: TConfig;
}

export interface ThyDashboardConfig extends GridsterConfig {}
