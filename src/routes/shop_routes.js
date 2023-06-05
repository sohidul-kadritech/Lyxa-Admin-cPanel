/* eslint-disable default-param-last */
// import CategoryList from '../pages/Categories&Tags/Category/CategoryList/CategoryList';
// import ShopList from '../pages/Shops/ShopList/ShopList';
// import ProductList from '../pages/Product/ProductList/ProductList';
// import Financials from '../pages/Financials';
// import ShopCredentialsList from '../pages/Shops/ShopCredentials/ShopCredentialsList';
import SingleShopTransactions from '../pages/AppWallet/SellerTransactions/SingleShopTansactions';
import ShopHourSettings from '../pages/Hours';
import Marketing from '../pages/Marketing';
import MarketingDashboard from '../pages/Marketing/Dashbaord';
import MenuPage from '../pages/Menu';
import NewOrders from '../pages/NewOrder';
import NotFoundPage from '../pages/NotFound';
import RiderProfile from '../pages/RiderProfile';
import RiderList from '../pages/Riders';
import ShopSettings2 from '../pages/Settings/Shop';
import ShopDashboard from '../pages/ShopDashboard';
import ShopFinancials from '../pages/ShopFinancials';
import ShopProfile from '../pages/ShopProfile';
import Users from '../pages/Users2';

export const shop_routes = (prefix = '', shopDeliveryType) => {
  const routes = [
    { path: `${prefix}/`, component: ShopDashboard },
    { path: `${prefix}/add-wallet/shop-transactions`, component: SingleShopTransactions },
    { path: `${prefix}/users`, component: () => <Users userType="shop" /> },
    { path: `${prefix}/hours`, component: ShopHourSettings },
    { path: `${prefix}/profile`, component: ShopProfile },
    { path: `${prefix}/menu`, component: MenuPage },
    { path: `${prefix}/settings`, component: ShopSettings2 },
    { path: `${prefix}/financials`, component: ShopFinancials },
    { path: `${prefix}/marketing`, component: () => <Marketing viewUserType="shop" /> },
    { path: `${prefix}/marketing/dashboard/:type/:id`, component: () => <MarketingDashboard viewUserType="shop" /> },
    { path: `${prefix}/new-orders`, component: () => <NewOrders showFor="shop" /> },
    { path: `${prefix}/*`, component: NotFoundPage },
    // { path: `${prefix}/products/list`, component: ProductList },
    // { path: `${prefix}/shops/list`, component: ShopList },
    // { path: `${prefix}/dashboard`, component: ShopDashboard },
    // { path: `${prefix}/categories/list`, component: CategoryList },
    // { path: `${prefix}/shop/credentials/list`, component: ShopCredentialsList },
  ];

  if (shopDeliveryType === 'self') {
    routes.unshift({ path: `${prefix}/riders`, component: () => <RiderList viewUserType="shop" /> });
    routes.unshift({ path: `${prefix}/riders/:riderId`, component: RiderProfile });
  }

  return routes;
};
