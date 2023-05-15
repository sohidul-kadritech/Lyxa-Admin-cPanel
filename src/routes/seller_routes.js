import ChildLayout from '../components/Layout/ChildLayout';
import CreateAdmin from '../pages/AdminControl/Admins/CreateAdmin/CreateAdmin';
import ShopsTransactions from '../pages/AppWallet/SellerTransactions/ShopsTransactions';
import SingleShopTransactions from '../pages/AppWallet/SellerTransactions/SingleShopTansactions';
import CategoryAdd from '../pages/Categories&Tags/Category/CategoryAdd/CategoryAdd';
import CategoryDetails from '../pages/Categories&Tags/Category/CategoryDetails/CategoryDetails';
import CategoryList from '../pages/Categories&Tags/Category/CategoryList/CategoryList';
import Dashboard from '../pages/Dashboard/index';
import OrderDetails from '../pages/Orders/OrderDetails/OrderDetails';
import OrdersList from '../pages/Orders/OrdersList/OrdersList';
import ProductAdd from '../pages/Product/ProductAdd/ProductAdd';
import ProductDetails from '../pages/Product/ProductDetails/ProductDetails';
import ProductList from '../pages/Product/ProductList/ProductList';
import SellerCredentialsList from '../pages/Seller/SellerCredentials/SellerCredentialsList';
import ShopAdd from '../pages/Shops/ShopAdd/ShopAdd';
import ShopDetails from '../pages/Shops/ShopDetails/ShopDetails';
import ShopList from '../pages/Shops/ShopList/ShopList';

export const seller_routes = [
  { path: '/', component: Dashboard },
  { path: '/orders/list', component: OrdersList },
  { path: '/orders/details/:id', component: OrderDetails },
  { path: '/products/list', component: ProductList },
  { path: '/products/add', component: ProductAdd },
  { path: '/products/edit/:id', component: ProductAdd },
  { path: '/products/details/:id', component: ProductDetails },
  { path: '/shops/list', component: ShopList },
  { path: '/shops/add', component: ShopAdd },
  { path: '/shops/edit/:id', component: ShopAdd },
  { path: '/shops/details/:id', component: ShopDetails },
  {
    path: '/app-wallet/seller/shops-transactions',
    component: ShopsTransactions,
  },
  {
    path: '/add-wallet/shop-transactions',
    component: SingleShopTransactions,
  },
  { path: '/seller/credentials/list', component: SellerCredentialsList },
  { path: '/admin/create', component: CreateAdmin },

  { path: '/categories/list', component: CategoryList },
  { path: '/categories/edit/:id', component: CategoryAdd },
  { path: '/category/details/:id', component: CategoryDetails },
  { path: '/shop/:shopId', component: () => <ChildLayout to="shop" routesPrefix="/shop/:shopId" /> },
];
