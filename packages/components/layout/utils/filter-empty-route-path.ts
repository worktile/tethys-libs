// import { Data } from '@angular/router';
// import { Route } from '@tethys/pro/core';

// export const menusMap: Map<string, Route & { rootMenu?: Data }> = new Map();

// export const filterEmptyRoutePath = (route: Data, menuGroup?: Data) => {
//     if (!route || !route.children) return;
//     return route.children.filter((item: Route) => {
//         if (item.path) {
//             const routeMap = menusMap.get(route.path);
//             let rootMenu = route;
//             if (routeMap && routeMap.rootMenu && routeMap.rootMenu.path) {
//                 rootMenu = routeMap.rootMenu;
//             }
//             menusMap.set(item.path, { ...item, rootMenu });
//             if (item.children) {
//                 item.children = filterEmptyRoutePath(item, route) as Route[];
//             }
//         }
//         return item.path;
//     });
// };
