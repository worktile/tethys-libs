import { Observable } from 'rxjs';

export interface ThyDashboardWidget<TConfig = unknown, TContent = unknown> {
    type: string;
    name: string;
    size: { cols: number; rows: number };
    position: { x: number; y: number };
    config?: TConfig;
    content?: (widget: ThyDashboardWidget<TConfig, TContent>) => Observable<TContent> | TContent;
}
