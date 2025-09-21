import { NextRouter } from "next/router";
import { addBasePath } from "next/dist/client/add-base-path";

export function redirectToRoot(router: NextRouter) {
  const l = getLinkPure({
    name: "HOME",
  });
  router.push(l);
}

type RouteParams =
  | {
      name: "HOME";
    }
  | {
      name: "SHOW";
      query: string;
    };

export function getLink(route: RouteParams) {
  const link = getLinkPure(route);
  return link;
  //  return addBasePath(link);
}

export function getLinkPure(route: RouteParams) {
  // TODO: handle base path etc
  switch (route.name) {
    case "HOME": {
      return "/";
    }

    case "SHOW": {
      return `/show/${route.query}`;
    }
  }
}

export function goTo(router: NextRouter, route: RouteParams) {
  const link = getLinkPure(route);

  router.push(link);
}
