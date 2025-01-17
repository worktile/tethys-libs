import { InjectionToken } from '@angular/core';
import { Route } from '@angular/router';
import { Observable } from 'rxjs';

export interface ThyMenuRoute {
    path?: string;
    title: string;
    icon?: string;
    children?: ThyMenuRoute[];
    parent?: ThyMenuRoute;
}

export interface ThyMenuLoadStrategy {
    load(): Observable<ThyMenuRoute[]>;
    getMenuByRoute(route: Route): ThyMenuRoute | undefined;
}

export const THY_MENU_LOAD_STRATEGY = new InjectionToken<ThyMenuLoadStrategy>('THY_MENU_LOAD_STRATEGY');
