import { seller_menu_items, shop_menu_items } from '../../common/sidebar_menu_items';
import { seller_routes } from '../../routes/seller_routes';
import { shop_routes } from '../../routes/shop_routes';

export const getRouteAndSidebarItems = (userType, prefix) => {
  let routes = [];
  let menuItems = [];

  if (userType === 'shop') {
    routes = shop_routes(prefix);
    menuItems = shop_menu_items(prefix);
  }

  if (userType === 'seller') {
    routes = seller_routes;
    menuItems = seller_menu_items;
  }

  return { routes, menuItems };
};
