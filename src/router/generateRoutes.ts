




export const generateRoutes = (routes) => {

  return routes.map(route => {
    const { Component, path } = route;
    return {
      Component: Component,
      path: path,
    
    };
  });
};
