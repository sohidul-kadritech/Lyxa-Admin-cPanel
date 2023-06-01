import SingleShopTransactions from '../pages/AppWallet/SellerTransactions/SingleShopTansactions';
import CategoryList from '../pages/Categories&Tags/Category/CategoryList/CategoryList';
import Financials from '../pages/Financials';
import ShopHourSettings from '../pages/Hours';
import Marketing from '../pages/Marketing';
import MarketingDashboard from '../pages/Marketing/Dashbaord';
import MenuPage from '../pages/Menu';
import NewOrders from '../pages/NewOrder';
import NotFoundPage from '../pages/NotFound';
import ProductList from '../pages/Product/ProductList/ProductList';
import ShopSettings2 from '../pages/Settings/Shop';
import ShopDashboard from '../pages/ShopDashboard';
import ShopProfile from '../pages/ShopProfile';
import ShopCredentialsList from '../pages/Shops/ShopCredentials/ShopCredentialsList';
import ShopList from '../pages/Shops/ShopList/ShopList';
import Users from '../pages/Users2';

export const shop_routes = (prefix = '') => {
  const routes = [
    { path: `${prefix}/`, component: ShopDashboard },
    { path: `${prefix}/categories/list`, component: CategoryList },
    { path: `${prefix}/shop/credentials/list`, component: ShopCredentialsList },
    {
      path: `${prefix}/add-wallet/shop-transactions`,
      component: SingleShopTransactions,
    },
    { path: `${prefix}/products/list`, component: ProductList },
    { path: `${prefix}/shops/list`, component: ShopList },
    // old pages ---
    { path: `${prefix}/users`, component: () => <Users userType="shop" /> },
    { path: `${prefix}/hours`, component: ShopHourSettings },
    { path: `${prefix}/profile`, component: ShopProfile },
    { path: `${prefix}/menu`, component: MenuPage },
    { path: `${prefix}/settings`, component: ShopSettings2 },
    { path: `${prefix}/financials`, component: () => <Financials viewUserType="shop" /> },
    { path: `${prefix}/marketing`, component: () => <Marketing viewUserType="shop" /> },
    { path: `${prefix}/marketing/dashboard/:type/:id`, component: () => <MarketingDashboard viewUserType="shop" /> },
    { path: `${prefix}/new-orders`, component: () => <NewOrders showFor="shop" /> },
    { path: `${prefix}/dashboard`, component: ShopDashboard },
    { path: `${prefix}/*`, component: NotFoundPage },
  ];

  return routes;
};
