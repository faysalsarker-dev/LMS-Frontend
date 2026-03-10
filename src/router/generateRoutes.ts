

interface IRoute {
  Component: React.ComponentType;
  path: string;
}


export const generateRoutes = (routes:any[]): any[] => {

  return routes.map(route => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Component, path, children, ...rest } = route as any;
    return {
      Component: Component,
      path: path,
      children: children ? generateRoutes(children) : undefined,
      ...rest
    };
  });
};
