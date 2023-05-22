import { TemplateRef, Type } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { SafeAny } from 'ngx-tethys/types';

export type ThyWidgetViewOutlet<T = unknown> = Type<T> | TemplateRef<any>;

export type ThyWidgetViewOutletContext = Record<string, SafeAny>;

export type ThyWidgetVieOutletWithContext<T = unknown> = { outlet: ThyWidgetViewOutlet<T>; context: ThyWidgetViewOutletContext };

export interface WidgetGridsterItem extends GridsterItem {
    widget: ThyWidgetItem;
    outlet: ThyWidgetViewOutlet;
    outletContext: ThyWidgetViewOutletContext;
}

export interface ThyWidgetItem<TConfig = unknown> {
    type: string;
    size: { cols: number; rows: number };
    position: { x: number; y: number };
    minSize: { rows: number; cols: number };
    name?: string;
    _id?: string;
    config?: TConfig;
}
