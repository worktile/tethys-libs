import { Data } from '@angular/router';
import { Route } from '../core';

export const MenusMap: Map<string, Route & { groupMenu: Route }> = new Map();

export const filterEmptyRoutePath = (route: Data, groupMenu?: Data) => {
    if (!route || !route.children) return;
    return route.children.filter((item: Route) => {
        if (item.path) {
            MenusMap.set(item.path, { ...item, groupMenu: route });
            if (item.children) {
                item.children = filterEmptyRoutePath(item, route) as Route[];
            }
        }
        return item.path;
    });
};
