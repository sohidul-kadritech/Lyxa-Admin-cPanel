import SingleShopTransactions from '../pages/AppWallet/SellerTransactions/SingleShopTansactions';
import CategoryList from '../pages/Categories&Tags/Category/CategoryList/CategoryList';
import Financials from '../pages/Financials';
import ShopHourSettings from '../pages/Hours';
import Marketing from '../pages/Marketing';
import MarketingDashboard from '../pages/Marketing/Dashbaord';
import MenuPage from '../pages/Menu';
import NewOrders from '../pages/NewOrder';
import NotFoundPage from '../pages/NotFound';
import OrdersList from '../pages/Orders/OrdersList/OrdersList';
import ProductList from '../pages/Product/ProductList/ProductList';
import ShopProfile from '../pages/Profile';
import ShopSettings2 from '../pages/Settings/Shop';
import ShopDashboard from '../pages/ShopDashboard';
import ShopCredentialsList from '../pages/Shops/ShopCredentials/ShopCredentialsList';
import ShopList from '../pages/Shops/ShopList/ShopList';
import Users2 from '../pages/Users2';

export const shop_routes = [
  { path: '/orders/list', component: OrdersList },
  { path: '/categories/list', component: CategoryList },
  { path: '/shop/credentials/list', component: ShopCredentialsList },
  {
    path: '/add-wallet/shop-transactions',
    component: SingleShopTransactions,
  },
  { path: '/products/list', component: ProductList },
  { path: '/shops/list', component: ShopList },
  // old pages ---
  { path: '/users', component: Users2 },
  { path: '/hours', component: ShopHourSettings },
  { path: '/profile', component: ShopProfile },
  { path: '/menu', component: MenuPage },
  { path: '/settings', component: ShopSettings2 },
  { path: '/financials', component: Financials },
  { path: '/marketing', component: Marketing },
  { path: '/marketing/dashboard/:type/:id', component: MarketingDashboard },
  { path: '/new-orders', component: NewOrders },
  { path: '/', component: ShopDashboard },
  { path: '*', component: NotFoundPage },
];
