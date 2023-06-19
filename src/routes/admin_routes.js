// Authentication

// Dashboard
import Dashboard from '../pages/Dashboard/index';

// Gallery
import AddBanner from '../pages/Banner/AddBanner';
import BannerPage from '../pages/Banner/BannerPage';

// User List
import AdminList from '../pages/AdminControl/Admins/AdminList.js/AdminList';
import CreateAdmin from '../pages/AdminControl/Admins/CreateAdmin/CreateAdmin';
import Role from '../pages/AdminControl/Role/Role';
import AdminShopList from '../pages/AdminShopList';
import AdminLogHistory from '../pages/AppWallet/AdminLogHistory/AdminLogHistory';
import DeliveryTransactions from '../pages/AppWallet/DeliveryTransactions/DeliveryTransactions';
import PaymentHistory from '../pages/AppWallet/PaymentHistory/PaymentHistory';
import PercentageSetting from '../pages/AppWallet/PercentageSetting/PercentageSetting';
import SellerTransactions from '../pages/AppWallet/SellerTransactions/SellerTransactions';
import ButlerCancelOrders from '../pages/Butler/ButlerCanceledOrders';
import ButlerOrderDetails from '../pages/Butler/ButlerOrderDetails';
import DatabaseSettings from '../pages/DatabaseSettings/DatabaseSettings';
import DealsAdd from '../pages/Deals/DealsAdd/DealsAdd';
import DealsList from '../pages/Deals/DealsList/DealsList';
import DeliverymanAdd from '../pages/Deliveryman/DeliverymanAdd/DeliverymanAdd';
import DeliverymanList from '../pages/Deliveryman/DeliverymanList/DeliverymanList';
import DropPayList from '../pages/DropPay/DropPayList/DropPayList';
import Faq from '../pages/Faq';
import Faq2 from '../pages/Faq2';
import Marketing from '../pages/Marketing';
import SellerAdd from '../pages/Seller/SellerAdd/SellerAdd';
import SellerList from '../pages/Seller/SellerList/SellerList';
import CouponSettings from '../pages/Settings/Admin/Marketing/CouponSettings';
import ShopAdd from '../pages/Shops/ShopAdd/ShopAdd';
import ShopList from '../pages/Shops/ShopList/ShopList';
import UserDetails from '../pages/Users/UserDetails/UserDetails';
import UsersList from '../pages/Users/UsersList/UsersList';

import AdminSettings from '../pages/AdminSettings/AdminSettings';
import AppSettings from '../pages/AppSettings/AppSettings';
import SingleDeliveryTransactions from '../pages/AppWallet/DeliveryTransactions/SingleDeliveryTransactions';
import DropTransactions from '../pages/AppWallet/DropsTansactions/DropTransactions';
import DropTransactionsDetails from '../pages/AppWallet/DropsTansactions/dropTransactionsDetails';
import ShopsTransactions from '../pages/AppWallet/SellerTransactions/ShopsTransactions';
import SingleShopTransactions from '../pages/AppWallet/SellerTransactions/SingleShopTansactions';
import ButlerOrderList from '../pages/Butler';
import CancelReason from '../pages/CancelReason/CancelReason';
import CancelReason2 from '../pages/CancelReason2';
import CategoryAdd from '../pages/Categories&Tags/Category/CategoryAdd/CategoryAdd';
import CategoryDetails from '../pages/Categories&Tags/Category/CategoryDetails/CategoryDetails';
import CategoryList from '../pages/Categories&Tags/Category/CategoryList/CategoryList';
import TagAdd from '../pages/Categories&Tags/Tags/TagAdd/TagAdd';
import TagsList from '../pages/Categories&Tags/Tags/TagsList/TagsList';
import ChatDetails from '../pages/Chat/ChatDetails/ChatDetails';
import DeliverymanDetails from '../pages/Deliveryman/DeliverymanDetails/DeliverymanDetails';
import OrderDetails from '../pages/Orders/OrderDetails/OrderDetails';
import ProductAdd from '../pages/Product/ProductAdd/ProductAdd';
import ProductDetails from '../pages/Product/ProductDetails/ProductDetails';
import ProductList from '../pages/Product/ProductList/ProductList';
import UnitTypes from '../pages/Product/UnitTypes/UnitTypes';
import RatingSettings from '../pages/Ratings';
import SellerDetails from '../pages/Seller/SellerDetails/SellerDetails';
import AdminDealSettings from '../pages/Settings/Admin/Marketing/DealSettings';
import ShopDetails from '../pages/Shops/ShopDetails/ShopDetails';
import UserTransaction from '../pages/Users/UserTransaction/UserTransaction';

import AdminLog from '../pages/AppWallet/PercentageSetting/AdminLog';
import ButlerFlaggedOrder from '../pages/Butler/ButlerFlaggedOrders';
import Chats from '../pages/Chat/Chats';
import ChatsListByOrder from '../pages/Chat/ChatsListByOrder/ChatsListByOrder';
import DefaultChat from '../pages/DefaultChat/DefaultChat';
import DisplaySettings from '../pages/Display';
import FilterContainers from '../pages/Display/FilterContainer';
import ListContainers from '../pages/Display/ListContainer';
import TagsAndCusines from '../pages/Display/Tags';
import MarketingDashboard from '../pages/Marketing/Dashbaord';
import NotificationsList from '../pages/Notifications/NotificationsList';
import SendNotifications from '../pages/Notifications/SendNotifications';

import AdminToSellerLayout from '../components/Layout/ChildLayouts/AdminToSellerLayout';
import SellerToShopLayout from '../components/Layout/ChildLayouts/SellerToShopLayout';
import AccountList from '../pages/Accounts';
import AdminControl from '../pages/AdminControl2';
import AdminFinancials from '../pages/AdminFinancials';
import AdminOrders from '../pages/AdminOrderTable';
import Appsettings2 from '../pages/AppSettings2';
import AccountFinancials from '../pages/AppWallet2/ForAccount';
import RidersTransactions from '../pages/AppWallet2/ForRider';
import FinancialsForSeller from '../pages/AppWallet2/ForSeller';
import ShopFinancialsTransaction from '../pages/AppWallet2/ForSeller/ShopFinancialsTransaction';
import ShopsFinancialsSpecificSellers from '../pages/AppWallet2/ForSeller/ShopsFinancialsSpecificSellers';
import Notification from '../pages/Notification2';
import PercentageSettings2 from '../pages/PercentageSettings';
import PrivacySettings from '../pages/Privacy';
import Product from '../pages/Product1';
import RatingSettings2 from '../pages/Ratings2';
import ReferFriend from '../pages/ReferFriend';
import RequestedArea from '../pages/RequestedArea';
import RiderProfile from '../pages/RiderProfile';
import RiderList from '../pages/Riders';
import SellerList2 from '../pages/Sellers2';
import ServiceZone from '../pages/ServiceZone';
import AdminSettings2 from '../pages/Settings/Admin';
import AdminMarketingSettings from '../pages/Settings/Admin/Marketing';
import AdminFeaturedSettings from '../pages/Settings/Admin/Marketing/FeaturedSettings';
import AdminLoyaltySettings from '../pages/Settings/Admin/Marketing/LoyaltySettings';
import ShopProfile from '../pages/ShopProfile';
import TermsAndConditions from '../pages/TermsAndConditons2/index';
import Transactions from '../pages/Transactions/Transactions';
import UserProfile from '../pages/UsersProfile';
import Vat from '../pages/Vat';
import Vat2 from '../pages/Vat2';

export const admin_routes = [
  // dashboard
  { path: '/', component: Dashboard },
  { path: '/financials', component: AdminFinancials },
  // { path: '/new-orders', component: () => <NewOrders showFor="admin" /> },
  { path: '/orders', component: AdminOrders },

  { path: '/orders/list', component: ButlerOrderList },
  { path: '/orders/details/regular/:id', component: OrderDetails },
  { path: '/orders/details/butler/:id', component: ButlerOrderDetails },
  { path: '/orders/list/cancel', component: ButlerCancelOrders },
  { path: '/orders/list/flagged', component: ButlerFlaggedOrder },

  // vat
  { path: '/vat2', component: Vat },
  { path: '/vat', component: Vat2 },
  { path: '/riders', component: RiderList, componentProps: { viewUserType: 'admin' } },
  { path: `/riders/:riderId`, component: RiderProfile },

  // users
  { path: '/accounts', component: AccountList },
  { path: '/accounts/:userId', component: UserProfile },
  { path: '/users/list', component: UsersList },
  { path: '/users/details/:id', component: UserDetails },
  { path: '/users/transactions/:id', component: UserTransaction },

  // sellers
  { path: '/seller/list', component: SellerList },
  { path: '/seller/list2', component: SellerList2 },
  { path: '/seller/list2/:sellerId', component: SellerList2 },
  { path: '/seller/add', component: SellerAdd },
  { path: '/seller/edit/:id', component: SellerAdd },
  { path: '/seller/details/:id', component: SellerDetails },
  { path: '/seller/dashboard/:sellerId', component: AdminToSellerLayout, exact: false },

  // shops
  { path: '/shops/list', component: ShopList, componentProps: { viewUserType: 'admin' } },
  // { path: '/shops/list', component: () => <ShopList viewUserType="admin" /> },
  { path: '/shops/add', component: ShopAdd },
  { path: '/shops/edit/:id', component: ShopAdd },
  { path: '/shops/details/:id', component: ShopDetails },
  // { path: '/shops/marketing/:id', component: () => <Marketing viewUserType="admin" /> },
  { path: '/shops/marketing/:id', component: Marketing, componentProps: { viewUserType: 'admin' } },
  {
    path: '/shops/marketing/dashboard/:shopId/:type/:id',
    component: MarketingDashboard,
    componentProps: { viewUserType: 'admin' },
  },

  { path: '/shop', component: AdminShopList },
  { path: '/shop/profile/:shopId', component: ShopProfile },
  { path: '/shop/dashboard/:shopId', component: SellerToShopLayout, exact: false },

  // product
  { path: '/products/list2', component: ProductList },
  { path: '/settings/products', component: Product },
  { path: '/products/add', component: ProductAdd },
  { path: '/products/edit/:id', component: ProductAdd },
  { path: '/products/details/:id', component: ProductDetails },
  { path: '/products/unit-types', component: UnitTypes },

  // delivery man
  { path: '/deliveryman/list', component: DeliverymanList },
  { path: '/deliveryman/add', component: DeliverymanAdd },
  { path: '/deliveryman/edit/:id', component: DeliverymanAdd },
  { path: '/deliveryman/details/:id', component: DeliverymanDetails },

  // deals
  { path: '/deals/list', component: DealsList },
  { path: '/deals/add', component: DealsAdd },
  { path: '/deals/edit/:id', component: DealsAdd },

  // drop pay
  { path: '/lyxa-pay', component: DropPayList },
  { path: '/lyxa-pay2', component: AccountFinancials },

  // app wallet
  { path: '/add-wallet/admin-log-history', component: AdminLogHistory },
  { path: '/add-wallet/seller-transactions', component: SellerTransactions },
  { path: '/add-wallet/seller-transactions2', component: FinancialsForSeller },
  {
    path: '/app-wallet/seller/shops-transactions',
    component: ShopsTransactions,
  },
  {
    path: '/app-wallet/seller/shops-transactions2',
    component: ShopsFinancialsSpecificSellers,
  },

  // transations
  {
    path: '/add-wallet/shop-transactions',
    component: SingleShopTransactions,
  },
  {
    path: '/add-wallet/shop-transactions2',
    component: ShopFinancialsTransaction,
  },
  // for rider
  {
    path: '/add-wallet/delivery-transactions',
    component: DeliveryTransactions,
  },
  {
    path: '/add-wallet/delivery-transactions2',
    component: RidersTransactions,
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

  // chat
  { path: '/customer-support', component: Chats },
  {
    path: '/customer-support/chats-by-single-order/:id',
    component: ChatsListByOrder,
  },
  { path: '/customer-support/details/:id', component: ChatDetails },

  // catagories and tags
  { path: '/tags/list', component: TagsList },
  { path: '/tags/add', component: TagAdd },

  // admin control
  { path: '/admin/list', component: AdminList },
  { path: '/admin/list2', component: AdminControl },
  { path: '/admin/create', component: CreateAdmin },
  { path: '/admin/edit/:id', component: CreateAdmin },
  { path: '/admin/role', component: Role },

  { path: '/percentage-setting', component: PercentageSetting },
  { path: '/percentage-setting2', component: PercentageSettings2 },

  //  settings
  { path: '/app/settings', component: AppSettings },
  { path: '/testing', component: AdminSettings2 },

  { path: '/settings/app-settings', component: Appsettings2 },
  { path: '/admin/settings2', component: AdminSettings },
  { path: '/admin/percentage-settings-history', component: AdminLog },
  { path: '/settings/refer-friend', component: ReferFriend },
  { path: '/admin/cancel-reason', component: CancelReason },
  { path: '/settings/cancel-reason', component: CancelReason2 },
  { path: '/admin/default-chat-message', component: DefaultChat },
  { path: '/admin/database/collections', component: DatabaseSettings },

  // settings
  { path: '/settings', component: AdminSettings2 },

  // marketing
  { path: '/settings/marketing', component: AdminMarketingSettings },
  { path: '/settings/marketing/loyalty', component: AdminLoyaltySettings },
  { path: '/settings/marketing/deals', component: AdminDealSettings },
  { path: '/settings/marketing/featured', component: AdminFeaturedSettings },
  { path: '/settings/marketing/coupons', component: CouponSettings },
  { path: '/settings/zone', component: ServiceZone },
  { path: '/settings/products/list', component: ProductList },
  { path: '/settings/products/add', component: ProductAdd },
  { path: '/settings/products/edit/:id', component: ProductAdd },
  { path: '/settings/products/details/:id', component: ProductDetails },
  { path: '/settings/products/unit-types', component: UnitTypes },
  { path: '/settings/ratings', component: RatingSettings2 },
  { path: '/settings/categories/list', component: CategoryList },
  { path: '/settings/categories/edit/:id', component: CategoryAdd },
  { path: '/settings/category/details/:id', component: CategoryDetails },

  // terms and conditions
  { path: '/terms-and-conditions', component: TermsAndConditions },
  { path: '/privacy', component: PrivacySettings },

  { path: '/admin/settings/zone', component: ServiceZone },

  // Chat Reason
  { path: '/settings/support-reasons2', component: Faq },
  { path: '/settings/support-reasons', component: Faq2 },
  { path: '/settings/ratings2', component: RatingSettings },

  // NOTIFICATIONS
  { path: '/admin/send-notifications', component: SendNotifications },
  { path: '/admin/notifications/list', component: NotificationsList },
  { path: '/settings/notifications', component: Notification },

  // DISPLAY
  { path: '/display', component: DisplaySettings },
  { path: '/display/list-containers', component: ListContainers },
  { path: '/display/filter-containers', component: FilterContainers },
  { path: '/display/tags-cusines', component: TagsAndCusines },
  { path: '/display/banner', component: BannerPage },
  { path: '/display/banner/add', component: AddBanner },
  { path: '/display/banner/edit/:id', component: AddBanner },
  { path: '/admin/requested-area', component: RequestedArea },
];
