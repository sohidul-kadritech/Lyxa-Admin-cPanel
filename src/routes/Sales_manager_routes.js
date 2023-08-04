// User List
import AdminToSellerLayout from '../components/Layout/ChildLayouts/AdminToSellerLayout';
import SellerToShopLayout from '../components/Layout/ChildLayouts/SellerToShopLayout';
import Marketing from '../pages/Marketing';
import MarketingDashboard from '../pages/Marketing/Dashbaord';
import SalesManagerDashBoard from '../pages/SalesManagerDashBoard';
import SellerAdd from '../pages/Seller/SellerAdd/SellerAdd';
import SellerDetails from '../pages/Seller/SellerDetails/SellerDetails';
import SellerList2 from '../pages/Sellers2';
import ShopProfile from '../pages/ShopProfile';

export const sales_manager_routes = [
  { path: '/', component: SalesManagerDashBoard },
  { path: '/seller/list', component: SellerList2 },
  { path: '/seller/list/:sellerId', component: SellerList2 },
  { path: '/seller/add', component: SellerAdd },
  { path: '/seller/edit/:id', component: SellerAdd },
  { path: '/seller/details/:id', component: SellerDetails },
  { path: '/seller/dashboard/:sellerId', component: AdminToSellerLayout, exact: false },
  { path: '/shops/:id/marketing/', component: Marketing, componentProps: { viewUserType: 'admin' } },
  {
    path: '/shops/:shopId/marketing/dashboard/:type/:id',
    component: MarketingDashboard,
    componentProps: { viewUserType: 'admin' },
  },
  { path: '/shop/profile/:shopId', component: ShopProfile },
  { path: '/shop/dashboard/:shopId', component: SellerToShopLayout, exact: false },
];
