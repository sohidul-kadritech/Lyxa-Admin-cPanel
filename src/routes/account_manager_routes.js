import Marketing from '../pages/Marketing';

import MarketingDashboard from '../pages/Marketing/Dashbaord';

import AdminToSellerLayout from '../components/Layout/ChildLayouts/AdminToSellerLayout';
import SellerToShopLayout from '../components/Layout/ChildLayouts/SellerToShopLayout';
import AccountManagerDashBoard from '../pages/AccountManagerDashBoard';
import SellerList2 from '../pages/Sellers2';
import ShopProfile from '../pages/ShopProfile';

export const account_manager_routes = [
  { path: '/', component: AccountManagerDashBoard },
  { path: '/seller/list/:sellerId', component: SellerList2 },
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
