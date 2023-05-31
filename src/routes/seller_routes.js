import SellerToShopLayout from '../components/Layout/ChildLayouts/SellerToShopLayout';
import CreateAdmin from '../pages/AdminControl/Admins/CreateAdmin/CreateAdmin';
import ShopsTransactions from '../pages/AppWallet/SellerTransactions/ShopsTransactions';
import SingleShopTransactions from '../pages/AppWallet/SellerTransactions/SingleShopTansactions';
import CategoryAdd from '../pages/Categories&Tags/Category/CategoryAdd/CategoryAdd';
import CategoryDetails from '../pages/Categories&Tags/Category/CategoryDetails/CategoryDetails';
import CategoryList from '../pages/Categories&Tags/Category/CategoryList/CategoryList';
import Dashboard from '../pages/Dashboard/index';
import Financials from '../pages/Financials';
import OrderDetails from '../pages/Orders/OrderDetails/OrderDetails';
import OrdersList from '../pages/Orders/OrdersList/OrdersList';
import ProductAdd from '../pages/Product/ProductAdd/ProductAdd';
import ProductDetails from '../pages/Product/ProductDetails/ProductDetails';
import ProductList from '../pages/Product/ProductList/ProductList';
import SellerCredentialsList from '../pages/Seller/SellerCredentials/SellerCredentialsList';
import SellerDashboard from '../pages/SellerDashboard';
import ShopList from '../pages/ShopList';
import ShopAdd from '../pages/Shops/ShopAdd/ShopAdd';
import ShopDetails from '../pages/Shops/ShopDetails/ShopDetails';
import ShopListOld from '../pages/Shops/ShopList/ShopList';
import Users from '../pages/Users2';

export const seller_routes = (prefix = '') => [
  { path: `${prefix}/`, component: SellerDashboard },
  { path: `${prefix}/old`, component: Dashboard },
  { path: `${prefix}/orders/list`, component: OrdersList },
  { path: `${prefix}/orders/details/:id`, component: OrderDetails },
  { path: `${prefix}/products/list`, component: ProductList },
  { path: `${prefix}/products/add`, component: ProductAdd },
  { path: `${prefix}/products/edit/:id`, component: ProductAdd },
  { path: `${prefix}/products/details/:id`, component: ProductDetails },
  { path: `${prefix}/shops/list-old`, component: ShopListOld },
  { path: `${prefix}/shops/list`, component: ShopList },
  { path: `${prefix}/shops/add`, component: ShopAdd },
  { path: `${prefix}/shops/edit/:id`, component: ShopAdd },
  { path: `${prefix}/shops/details/:id`, component: ShopDetails },
  { path: `${prefix}/users`, component: () => <Users userType="seller" /> },
  { path: `${prefix}/financials`, component: () => <Financials viewUserType="seller" /> },
  {
    path: `${prefix}/app-wallet/seller/shops-transactions`,
    component: ShopsTransactions,
  },
  {
    path: `${prefix}/add-wallet/shop-transactions`,
    component: SingleShopTransactions,
  },
  { path: `${prefix}/seller/credentials/list`, component: SellerCredentialsList },
  { path: `${prefix}/admin/create`, component: CreateAdmin },

  { path: `${prefix}/categories/list`, component: CategoryList },
  { path: `${prefix}/categories/edit/:id`, component: CategoryAdd },
  { path: `${prefix}/category/details/:id`, component: CategoryDetails },
  {
    path: `${prefix}/shop/dashboard/:shopId`,
    exact: false,
    component: SellerToShopLayout,
  },
];
