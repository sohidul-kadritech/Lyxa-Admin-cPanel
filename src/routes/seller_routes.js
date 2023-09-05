import SellerToShopLayout from '../components/Layout/ChildLayouts/SellerToShopLayout';
import ShopsTransactions from '../pages/AppWallet/SellerTransactions/ShopsTransactions';
import ShopFinancialsTransaction from '../pages/AppWallet2/ForSeller/ShopFinancialsTransaction';
import NewOrders from '../pages/NewOrder';
import SellerDashboard from '../pages/SellerDashboard';
import SellerFinancials from '../pages/SellerFinancials';
import SellerShopList from '../pages/SellerShopList';
import Users from '../pages/Users2';

export const seller_routes = (prefix = '') => [
  { path: `${prefix}/`, component: SellerDashboard },
  { path: `${prefix}/orders/list`, component: NewOrders, componentProps: { showFor: 'shop' } },
  { path: `${prefix}/shops/list`, component: SellerShopList },
  { path: `${prefix}/users`, component: Users, componentProps: { userType: 'seller' } },
  { path: `${prefix}/financials`, component: SellerFinancials },
  {
    path: `${prefix}/app-wallet/seller/shops-transactions`,
    component: ShopsTransactions,
  },
  {
    path: `${prefix}/app-wallet/shop-transactions`,
    component: ShopFinancialsTransaction,
    componentProps: { viewUserType: 'seller' },
  },
  {
    path: `${prefix}/shop/dashboard/:shopId`,
    exact: false,
    component: SellerToShopLayout,
  },
];
