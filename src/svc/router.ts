import { NextRouter } from "next/router";

export function redirectToRoot(router: NextRouter) {
  const l = getLink({
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
  // TODO: handle base path etc
  switch (route.name) {
    case "HOME": {
      return "/";
    }

    case "SHOW": {
      return `/show?c=${route.query}`;
    }
  }
}

export function goTo(router: NextRouter, route: RouteParams) {
  const link = getLink(route);

  router.push(link);
}
