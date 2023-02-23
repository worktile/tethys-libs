import { GridsterItem } from 'angular-gridster2';
import { SafeAny } from 'ngx-tethys/types';

export interface WidgetGridsterItem extends GridsterItem {
    widget: ThyWidgetItem;
}

export interface ThyWidgetItem<TConfig = SafeAny> {
    type: string;
    size: { cols: number; rows: number };
    position: { x: number; y: number };
    minSize: { rows: number; cols: number };
    name?: string;
    _id?: string;
    config?: TConfig;
}
