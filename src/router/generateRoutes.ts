

interface IRoute {
  Component: React.ComponentType;
  path: string;
}


export const generateRoutes = (routes:IRoute[]) => {

  return routes.map(route => {
    const { Component, path } = route;
    return {
      Component: Component,
      path: path,
    
    };
  });
};
