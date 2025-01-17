import { Observable, of } from 'rxjs';
import { ThyMenuLoadStrategy, ThyMenuRoute } from './menu';
import { inject, Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ThyMenuLoadDefaultStrategy implements ThyMenuLoadStrategy {
    private router = inject(Router);

    private menuByRouteMap = new Map<Route, ThyMenuRoute>();

    private parseMenuByRoute(parentRoute: Route, parentMenu?: ThyMenuRoute): ThyMenuRoute[] {
        const routes = parentRoute?.children
            ?.filter((route) => {
                return route.path && route.data && route.data.title;
            })
            .map((route) => {
                const result: ThyMenuRoute = {
                    title: route.data?.title,
                    icon: route.data?.icon,
                    path: route.path,
                    parent: parentMenu
                };
                (result.children = this.parseMenuByRoute(route, result)), this.menuByRouteMap.set(route, result);
                return result;
            });
        return routes as ThyMenuRoute[];
    }

    load(): Observable<ThyMenuRoute[]> {
        const rootRoute = this.router.config.find((route) => route.path === '');
        if (rootRoute) {
            return of(this.parseMenuByRoute(rootRoute));
        } else {
            return of([]);
        }
    }

    getMenuByRoute(route: Route): ThyMenuRoute | undefined {
        return this.menuByRouteMap.get(route);
    }
}
