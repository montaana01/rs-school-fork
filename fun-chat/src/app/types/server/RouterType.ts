export type RouteType = {
  path: string;
  view: () => HTMLElement;
  requiresAuth: boolean;
  requiresGuest: boolean;
};
