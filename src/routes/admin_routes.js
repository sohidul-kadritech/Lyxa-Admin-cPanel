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
import ServiceZone from '../pages/ServiceZone';
import AdminSettings2 from '../pages/Settings/Admin';
import AdminMarketingSettings from '../pages/Settings/Admin/Marketing';
import AdminFeaturedSettings from '../pages/Settings/Admin/Marketing/FeaturedSettings';
import AdminLoyaltySettings from '../pages/Settings/Admin/Marketing/LoyaltySettings';
import DeliveryTermsAndConditions from '../pages/TermsAndConditons/DeliveryTermsAndConditions';
import ShopTermsAndConditions from '../pages/TermsAndConditons/ShopTermsAndConditions';
import UserTermsAndConditions from '../pages/TermsAndConditons/UserTermsAndConditions';
import Transactions from '../pages/Transactions/Transactions';
import Vat from '../pages/Vat';

export const admin_routes = [
  // dashboard
  { path: '/', component: Dashboard },

  { path: '/orders/list', component: ButlerOrderList },
  { path: '/orders/details/regular/:id', component: OrderDetails },
  { path: '/orders/details/butler/:id', component: ButlerOrderDetails },
  { path: '/orders/list/cancel', component: ButlerCancelOrders },
  { path: '/orders/list/flagged', component: ButlerFlaggedOrder },

  // vat
  { path: '/vat', component: Vat },

  // users
  { path: '/users/list', component: UsersList },
  { path: '/users/details/:id', component: UserDetails },
  { path: '/users/transactions/:id', component: UserTransaction },

  // sellers
  { path: '/seller/list', component: SellerList },
  { path: '/seller/add', component: SellerAdd },
  { path: '/seller/edit/:id', component: SellerAdd },
  { path: '/seller/details/:id', component: SellerDetails },
  { path: '/seller/dashboard/:sellerId', component: AdminToSellerLayout, exact: false },

  // shops
  { path: '/shops/list', component: ShopList },
  { path: '/shops/add', component: ShopAdd },
  { path: '/shops/edit/:id', component: ShopAdd },
  { path: '/shops/details/:id', component: ShopDetails },
  { path: '/shops/marketing/:id', component: Marketing },
  { path: '/shops/marketing/dashboard/:shopId/:type/:id', component: MarketingDashboard },

  // product
  { path: '/products/list', component: ProductList },
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

  // app wallet
  { path: '/add-wallet/admin-log-history', component: AdminLogHistory },
  { path: '/add-wallet/seller-transactions', component: SellerTransactions },
  {
    path: '/app-wallet/seller/shops-transactions',
    component: ShopsTransactions,
  },

  // transations
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

  // chat
  { path: '/customer-support', component: Chats },
  {
    path: '/customer-support/chats-by-single-order/:id',
    component: ChatsListByOrder,
  },
  { path: '/customer-support/details/:id', component: ChatDetails },

  // catagories and tags
  { path: '/categories/list', component: CategoryList },
  { path: '/categories/edit/:id', component: CategoryAdd },
  { path: '/category/details/:id', component: CategoryDetails },
  { path: '/tags/list', component: TagsList },
  { path: '/tags/add', component: TagAdd },

  // admin control
  { path: '/admin/list', component: AdminList },
  { path: '/admin/create', component: CreateAdmin },
  { path: '/admin/edit/:id', component: CreateAdmin },
  { path: '/admin/role', component: Role },

  //  settings
  { path: '/admin/settings', component: AdminSettings },
  { path: '/app/settings', component: AppSettings },
  { path: '/percentage-setting', component: PercentageSetting },
  { path: '/admin/percentage-settings-history', component: AdminLog },
  { path: '/admin/cancel-reason', component: CancelReason },
  { path: '/admin/cancel-reason2', component: CancelReason2 },
  { path: '/admin/default-chat-message', component: DefaultChat },
  { path: '/admin/database/collections', component: DatabaseSettings },

  { path: '/admin/settings2', component: AdminSettings2 },
  { path: '/admin/settings2/marketing', component: AdminMarketingSettings },
  { path: '/admin/settings2/marketing/loyalty', component: AdminLoyaltySettings },
  { path: '/admin/settings2/marketing/deals', component: AdminDealSettings },
  { path: '/admin/settings2/marketing/featured', component: AdminFeaturedSettings },
  { path: '/admin/settings2/marketing/coupons', component: CouponSettings },

  // terms and conditions
  { path: '/terms-and-conditions/user-app', component: UserTermsAndConditions },
  { path: '/terms-and-conditions/shop-app', component: ShopTermsAndConditions },
  {
    path: '/terms-and-conditions/delivery-app',
    component: DeliveryTermsAndConditions,
  },

  // Chat Reason
  { path: '/settings/support-reasons', component: Faq },
  { path: '/settings/support-reasons2', component: Faq2 },
  { path: '/settings/ratings', component: RatingSettings },

  // NOTIFICATIONS
  { path: '/admin/send-notifications', component: SendNotifications },
  { path: '/admin/notifications/list', component: NotificationsList },

  // DISPLAY
  { path: '/display', component: DisplaySettings },
  { path: '/display/list-containers', component: ListContainers },
  { path: '/display/filter-containers', component: FilterContainers },
  { path: '/display/tags-cusines', component: TagsAndCusines },
  { path: '/display/banner', component: BannerPage },
  { path: '/display/banner/add', component: AddBanner },
  { path: '/display/banner/edit/:id', component: AddBanner },
  { path: '/admin/zone', component: ServiceZone },
];
