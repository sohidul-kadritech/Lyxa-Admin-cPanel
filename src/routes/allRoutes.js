import React from 'react';
import { Redirect } from 'react-router-dom';

// Authentication related pages
import ForgetPwd from '../pages/Authentication/ForgetPassword';
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import Calendar from '../pages/Calendar';

//  // Inner Authentication

// Dashboard
import Dashboard from '../pages/Dashboard/index';

// Forms
import FormUpload from '../pages/Forms/FormUpload';

// Pages
import Pages404 from '../pages/Utility/pages-404';
import Pages500 from '../pages/Utility/pages-500';
import PagesComingsoon from '../pages/Utility/pages-comingsoon';
import PagesMaintenance from '../pages/Utility/pages-maintenance';
import PagesGallery from '../pages/Utility/PagesGallery';

// Gallery
import AddBanner from '../pages/banner/AddBanner';
import BannerPage from '../pages/banner/BannerPage';
import ImageFolder from '../pages/gallery/ImageFolder';

// User List

import UsersList from '../pages/Users/UsersList/UsersList';

import AdminList from '../pages/AdminControl/Admins/AdminList.js/AdminList';
import CreateAdmin from '../pages/AdminControl/Admins/CreateAdmin/CreateAdmin';
import Role from '../pages/AdminControl/Role/Role';
import AdminLogHistory from '../pages/AppWallet/AdminLogHistory/AdminLogHistory';
import DeliveryTransactions from '../pages/AppWallet/DeliveryTransactions/DeliveryTransactions';
import PaymentHistory from '../pages/AppWallet/PaymentHistory/PaymentHistory';
import PercentageSetting from '../pages/AppWallet/PercentageSetting/PercentageSetting';
import SellerTransactions from '../pages/AppWallet/SellerTransactions/SellerTransactions';
import DatabaseSettings from '../pages/DatabaseSettings/DatabaseSettings';
import DealsAdd from '../pages/Deals/DealsAdd/DealsAdd';
import DealsList from '../pages/Deals/DealsList/DealsList';
import DeliverymanAdd from '../pages/Deliveryman/DeliverymanAdd/DeliverymanAdd';
import DeliverymanList from '../pages/Deliveryman/DeliverymanList/DeliverymanList';
import DropPayList from '../pages/DropPay/DropPayList/DropPayList';
import OrdersList from '../pages/Orders/OrdersList/OrdersList';
import SellerAdd from '../pages/Seller/SellerAdd/SellerAdd';
import SellerList from '../pages/Seller/SellerList/SellerList';
import ShopAdd from '../pages/Shops/ShopAdd/ShopAdd';
import ShopList from '../pages/Shops/ShopList/ShopList';
import UserDetails from '../pages/Users/UserDetails/UserDetails';

import AdminSettings from '../pages/AdminSettings/AdminSettings';
import AppSettings from '../pages/AppSettings/AppSettings';
import SingleDeliveryTransactions from '../pages/AppWallet/DeliveryTransactions/SingleDeliveryTransactions';
import DropTransactions from '../pages/AppWallet/DropsTansactions/DropTransactions';
import DropTransactionsDetails from '../pages/AppWallet/DropsTansactions/dropTransactionsDetails';
import ShopsTransactions from '../pages/AppWallet/SellerTransactions/ShopsTransactions';
import SingleShopTransactions from '../pages/AppWallet/SellerTransactions/SingleShopTansactions';
import CancelReason from '../pages/CancelReason/CancelReason';
import CategoryAdd from '../pages/Categories&Tags/Category/CategoryAdd/CategoryAdd';
import CategoryDetails from '../pages/Categories&Tags/Category/CategoryDetails/CategoryDetails';
import CategoryList from '../pages/Categories&Tags/Category/CategoryList/CategoryList';
import TagAdd from '../pages/Categories&Tags/Tags/TagAdd/TagAdd';
import TagsList from '../pages/Categories&Tags/Tags/TagsList/TagsList';
import ChatDetails from '../pages/Chat/ChatDetails/ChatDetails';
import DeliverymanDetails from '../pages/Deliveryman/DeliverymanDetails/DeliverymanDetails';
import OrderDetails from '../pages/Orders/OrderDetails/OrderDetails';
import RefusedOrders from '../pages/Orders/RefusedOrders/RefusedOrders';
import ProductAdd from '../pages/Product/ProductAdd/ProductAdd';
import ProductDetails from '../pages/Product/ProductDetails/ProductDetails';
import ProductList from '../pages/Product/ProductList/ProductList';
import UnitTypes from '../pages/Product/UnitTypes/UnitTypes';
import SellerDetails from '../pages/Seller/SellerDetails/SellerDetails';
import Cuisine from '../pages/Shops/Cuisine';
import ShopDetails from '../pages/Shops/ShopDetails/ShopDetails';
import UserTransaction from '../pages/Users/UserTransaction/UserTransaction';

import AdminLog from '../pages/AppWallet/PercentageSetting/AdminLog';
import Chats from '../pages/Chat/Chats';
import ChatsListByOrder from '../pages/Chat/ChatsListByOrder/ChatsListByOrder';
import DefaultChat from '../pages/DefaultChat/DefaultChat';
import NotificationsList from '../pages/Notifications/NotificationsList';
import SendNotifications from '../pages/Notifications/SendNotifications';
import SellerCredentialsList from '../pages/Seller/SellerCredentials/SellerCredentialsList';
import ShopCredentialsList from '../pages/Shops/ShopCredentials/ShopCredentialsList';
import Tags from '../pages/Tags/Tags';
import DeliveryTermsAndConditions from '../pages/TermsAndConditons/DeliveryTermsAndConditions';
import ShopTermsAndConditions from '../pages/TermsAndConditons/ShopTermsAndConditions';
import UserTermsAndConditions from '../pages/TermsAndConditons/UserTermsAndConditions';
import Transactions from '../pages/Transactions/Transactions';

const userRoutes = [
  { path: '/dashboard', component: Dashboard },
  { path: '/orders/list', component: OrdersList },
  { path: '/orders/details/:id', component: OrderDetails },
  { path: '/orders/refused', component: RefusedOrders },
  // { path: "/ui/cards", component: UiCards },
  // { path: "/ui/data-tables", component: DatatableTables },
  // { path: "/ui/tables", component: BasicTables },

  { path: '/image-gallery', component: PagesGallery },
  { path: '/image-folder', component: ImageFolder },
  { path: '/image-upload', component: FormUpload },

  // Banner
  { path: '/banner', component: BannerPage },
  { path: '/banner/add', component: AddBanner },
  { path: '/banner/edit/:id', component: AddBanner },

  // Users

  { path: '/users/list', component: UsersList },
  { path: '/users/details/:id', component: UserDetails },
  { path: '/users/transactions/:id', component: UserTransaction },

  // SELLER

  { path: '/seller/list', component: SellerList },
  { path: '/seller/add', component: SellerAdd },
  { path: '/seller/edit/:id', component: SellerAdd },
  { path: '/seller/details/:id', component: SellerDetails },

  // SHOPS

  { path: '/shops/list', component: ShopList },
  { path: '/shops/add', component: ShopAdd },
  { path: '/shops/edit/:id', component: ShopAdd },
  { path: '/shops/details/:id', component: ShopDetails },
  { path: '/shops/cuisines', component: Cuisine },
  { path: '/shops/tags', component: Tags },

  // PRODUCT

  { path: '/products/list', component: ProductList },
  { path: '/products/add', component: ProductAdd },
  { path: '/products/edit/:id', component: ProductAdd },
  { path: '/products/details/:id', component: ProductDetails },
  { path: '/products/unit-types', component: UnitTypes },

  // DELIVERY MAN

  { path: '/deliveryman/list', component: DeliverymanList },
  { path: '/deliveryman/add', component: DeliverymanAdd },
  { path: '/deliveryman/edit/:id', component: DeliverymanAdd },
  { path: '/deliveryman/details/:id', component: DeliverymanDetails },

  // DEALS

  { path: '/deals/list', component: DealsList },
  { path: '/deals/add', component: DealsAdd },
  { path: '/deals/edit/:id', component: DealsAdd },

  // DROP PAY
  { path: '/lyxa-pay', component: DropPayList },

  // APP WALLET

  { path: '/add-wallet/admin-log-history', component: AdminLogHistory },
  { path: '/add-wallet/seller-transactions', component: SellerTransactions },
  {
    path: '/app-wallet/seller/shops-transactions',
    component: ShopsTransactions,
  },
  {
    path: '/add-wallet/shop-transactions',
    component: SingleShopTransactions,
  },
  {
    path: '/add-wallet/delivery-transactions',
    component: DeliveryTransactions,
  },
  {
    path: '/add-wallet/single-delivery-transactions/:id',
    component: SingleDeliveryTransactions,
  },
  { path: '/add-wallet/payments-history', component: PaymentHistory },
  { path: '/add-wallet/drop-transactions', component: DropTransactions },
  {
    path: '/add-wallet/drop-transactions/details/:id',
    component: DropTransactionsDetails,
  },

  { path: '/admin/transactions', component: Transactions },

  // CHAT

  { path: '/customer-support', component: Chats },
  {
    path: '/customer-support/chats-by-single-order/:id',
    component: ChatsListByOrder,
  },
  { path: '/customer-support/details/:id', component: ChatDetails },

  // CATEGORIES AND TAGS

  { path: '/categories/list', component: CategoryList },
  // { path: "/categories/add", component: CategoryAdd },
  { path: '/categories/edit/:id', component: CategoryAdd },
  { path: '/category/details/:id', component: CategoryDetails },

  { path: '/tags/list', component: TagsList },
  { path: '/tags/add', component: TagAdd },

  // ADMIN CONTROL

  { path: '/admin/list', component: AdminList },
  { path: '/admin/create', component: CreateAdmin },
  { path: '/admin/edit/:id', component: CreateAdmin },
  { path: '/admin/role', component: Role },

  //  SETTINGS

  { path: '/admin/settings', component: AdminSettings },
  { path: '/app/settings', component: AppSettings },
  { path: '/percentage-setting', component: PercentageSetting },
  { path: '/admin/percentage-settings-history', component: AdminLog },
  { path: '/admin/cancel-reason', component: CancelReason },
  { path: '/admin/default-chat-message', component: DefaultChat },
  { path: '/admin/database/collections', component: DatabaseSettings },

  // TERMS AND CONDTIONS

  { path: '/terms-and-conditions/user-app', component: UserTermsAndConditions },
  { path: '/terms-and-conditions/shop-app', component: ShopTermsAndConditions },
  {
    path: '/terms-and-conditions/delivery-app',
    component: DeliveryTermsAndConditions,
  },

  // NOTIFICATIONS

  { path: '/admin/send-notifications', component: SendNotifications },
  { path: '/admin/notifications/list', component: NotificationsList },

  // this route should be at the end of all other routes
  { path: '/', exact: true, component: () => <Redirect to="/dashboard" /> },
];
const customerServiceRoutes = [
  { path: '/orders/list', component: OrdersList },
  { path: '/orders/details/:id', component: OrderDetails },
  { path: '/users/list', component: UsersList },
  { path: '/users/details/:id', component: UserDetails },
  { path: '/seller/list', component: SellerList },
  { path: '/seller/details/:id', component: SellerDetails },
  { path: '/shops/list', component: ShopList },
  { path: '/shops/details/:id', component: ShopDetails },
  { path: '/deliveryman/list', component: DeliverymanList },
  { path: '/deliveryman/details/:id', component: DeliverymanDetails },
  { path: '/deliveryman/add', component: DeliverymanAdd },
  { path: '/drop-pay', component: DropPayList },
  { path: '/customer-support', component: Chats },
  { path: '/calender', component: Calendar },
  {
    path: '/customer-support/chats-by-single-order/:id',
    component: ChatsListByOrder,
  },
  { path: '/customer-support/details/:id', component: ChatDetails },
  // this route should be at the end of all other routes
  { path: '/', exact: true, component: () => <Redirect to="/orders/list" /> },
];

const sellerRoutes = [
  { path: '/dashboard', component: Dashboard },
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
  // { path: "/categories/add", component: CategoryAdd },
  { path: '/categories/edit/:id', component: CategoryAdd },
  { path: '/category/details/:id', component: CategoryDetails },

  // this route should be at the end of all other routes
  { path: '/', exact: true, component: () => <Redirect to="/dashboard" /> },
];

const shopRoutes = [
  { path: '/dashboard', component: Dashboard },

  { path: '/orders/list', component: OrdersList },
  { path: '/orders/details/:id', component: OrderDetails },

  { path: '/shops/list', component: ShopList },
  { path: '/shops/details/:id', component: ShopDetails },

  { path: '/products/list', component: ProductList },
  { path: '/products/add', component: ProductAdd },
  { path: '/products/edit/:id', component: ProductAdd },
  { path: '/products/details/:id', component: ProductDetails },
  {
    path: '/add-wallet/shop-transactions',
    component: SingleShopTransactions,
  },
  { path: '/shop/credentials/list', component: ShopCredentialsList },
  { path: '/admin/create', component: CreateAdmin },

  { path: '/categories/list', component: CategoryList },
  { path: '/categories/add', component: CategoryAdd },
  { path: '/categories/edit/:id', component: CategoryAdd },
  { path: '/category/details/:id', component: CategoryDetails },

  // this route should be at the end of all other routes
  { path: '/', exact: true, component: () => <Redirect to="/dashboard" /> },
];

const authRoutes = [
  // { path: "/logout", component: Logout },
  { path: '/login', component: Login },
  { path: '/forgot-password', component: ForgetPwd },
  { path: '/register', component: Register },

  { path: '/pages-maintenance', component: PagesMaintenance },
  { path: '/pages-comingsoon', component: PagesComingsoon },
  { path: '/pages-404', component: Pages404 },
  { path: '/pages-500', component: Pages500 },

  // this route should be at the end of all other routes
  // { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }
];

export { userRoutes, authRoutes, customerServiceRoutes, shopRoutes, sellerRoutes };
