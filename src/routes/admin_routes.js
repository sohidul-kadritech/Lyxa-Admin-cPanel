import AdminToSellerLayout from '../components/Layout/ChildLayouts/AdminToSellerLayout';
import SellerToShopLayout from '../components/Layout/ChildLayouts/SellerToShopLayout';
import AccountList from '../pages/Accounts';
import CreateAdmin from '../pages/AdminControl/Admins/CreateAdmin/CreateAdmin';
import Role from '../pages/AdminControl/Role/Role';
import AdminControl from '../pages/AdminControl2';
import AdminFinancials from '../pages/AdminFinancials';
import AdminLogs from '../pages/AdminLogs';
import AdminOrders from '../pages/AdminOrderTable';
import AdminSettings from '../pages/AdminSettings/AdminSettings';
import AdminShopList from '../pages/AdminShopList';
import AppSettings from '../pages/AppSettings/AppSettings';
import Appsettings2 from '../pages/AppSettings2';
import SingleDeliveryTransactions from '../pages/AppWallet/DeliveryTransactions/SingleDeliveryTransactions';
import DropTransactions from '../pages/AppWallet/DropsTansactions/DropTransactions';
import DropTransactionsDetails from '../pages/AppWallet/DropsTansactions/dropTransactionsDetails';
import PaymentHistory from '../pages/AppWallet/PaymentHistory/PaymentHistory';
import AdminLog from '../pages/AppWallet/PercentageSetting/AdminLog';
import AccountFinancials from '../pages/AppWallet2/ForAccount';
import RidersTransactions from '../pages/AppWallet2/ForRider';
import FinancialsForSeller from '../pages/AppWallet2/ForSeller';
import ShopFinancialsTransaction from '../pages/AppWallet2/ForSeller/ShopFinancialsTransaction';
import ShopsFinancialsSpecificSellers from '../pages/AppWallet2/ForSeller/ShopsFinancialsSpecificSellers';
import AddBanner from '../pages/Banner/AddBanner';
import AdBanner from '../pages/Banner2';
import CancelReason2 from '../pages/CancelReason2';
import CategoryList2 from '../pages/CategoryList';
import ChatDetails from '../pages/Chat/ChatDetails/ChatDetails';
import ChatsListByOrder from '../pages/Chat/ChatsListByOrder/ChatsListByOrder';
import CouponSettings from '../pages/CouponSettings';
import Dashboard from '../pages/Dashboard/index';
import DatabaseSettings from '../pages/DatabaseSettings/DatabaseSettings';
import DefaultChat2 from '../pages/DefaultChat2';
import DisplaySettings from '../pages/Display';
import FilterContainers from '../pages/Display/FilterContainer';
import ListContainers from '../pages/Display/ListContainer';
import TagsAndCusines from '../pages/Display/Tags';
import Faq2 from '../pages/Faq2';
import LyxaFinancials from '../pages/LyxaFinancials';
import LyxaButlerOrderFinancials from '../pages/LyxaFinancials/ButlerOrderFinancials';
import LyxaOrderFinancials from '../pages/LyxaFinancials/OrderFinancials';
import OrderFinancialsSummary from '../pages/LyxaFinancials/OrderFinancialsSummery';
import Marketing from '../pages/Marketing';
import MarketingDashboard from '../pages/Marketing/Dashbaord';
import Notification from '../pages/Notification2';
import PercentageSettings2 from '../pages/PercentageSettings';
import PrivacySettings from '../pages/Privacy';
import Product from '../pages/Product1';
import RatingSettings2 from '../pages/Ratings2';
import ReferFriend from '../pages/ReferFriend';
import RequestedArea from '../pages/RequestedArea';
import RiderProfile from '../pages/RiderProfile';
import RiderList from '../pages/Riders';
import SellerAdd from '../pages/Seller/SellerAdd/SellerAdd';
import SellerDetails from '../pages/Seller/SellerDetails/SellerDetails';
import SellerList2 from '../pages/Sellers2';
import ServiceZone from '../pages/ServiceZone';
import AdminSettings2 from '../pages/Settings/Admin';
import AdminMarketingSettings from '../pages/Settings/Admin/Marketing';
import AdminDealSettings from '../pages/Settings/Admin/Marketing/DealSettings';
import AdminFeaturedSettings from '../pages/Settings/Admin/Marketing/FeaturedSettings';
import AdminLoyaltySettings from '../pages/Settings/Admin/Marketing/LoyaltySettings';
import ShopProfile from '../pages/ShopProfile';
import TermsAndConditions from '../pages/TermsAndConditons2/index';
import TestChat from '../pages/TestChat';
import Tickets from '../pages/Tickets';
import UserProfile from '../pages/UsersProfile';
import Vat2 from '../pages/Vat2';

export const admin_routes = [
  { path: '/', component: Dashboard },
  { path: '/financials', component: AdminFinancials },
  { path: '/financials/lyxa', component: LyxaFinancials },
  { path: '/financials/lyxa/summary', component: OrderFinancialsSummary, componentProps: { shopType: 'food' } },
  { path: '/financials/lyxa/food', component: LyxaOrderFinancials, componentProps: { shopType: 'food' } },
  { path: '/financials/lyxa/grocery', component: LyxaOrderFinancials, componentProps: { shopType: 'grocery' } },
  { path: '/financials/lyxa/butler', component: LyxaButlerOrderFinancials },
  { path: '/financials/lyxa/pharmacy', component: LyxaOrderFinancials, componentProps: { shopType: 'pharmacy' } },
  { path: '/test-chat', component: TestChat },

  { path: '/orders', component: AdminOrders },

  // vat
  { path: '/vat', component: Vat2 },
  { path: '/riders', component: RiderList, componentProps: { viewUserType: 'admin' } },
  { path: `/riders/:riderId`, component: RiderProfile },

  // users
  { path: '/users', component: AccountList },
  { path: '/users/:userId', component: UserProfile },

  // sellers
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

  { path: '/shop', component: AdminShopList },
  { path: '/shop/profile/:shopId', component: ShopProfile },
  { path: '/shop/dashboard/:shopId', component: SellerToShopLayout, exact: false },
  { path: '/settings/products', component: Product },

  // drop pay
  { path: '/lyxa-pay', component: AccountFinancials },

  // app wallet
  { path: '/add-wallet/admin-log-history', component: AdminLogs },

  { path: '/add-wallet/seller-transactions', component: FinancialsForSeller },

  {
    path: '/app-wallet/seller/shops-transactions',
    component: ShopsFinancialsSpecificSellers,
  },

  {
    path: '/add-wallet/shop-transactions',
    component: ShopFinancialsTransaction,
  },

  // for rider
  {
    path: '/add-wallet/delivery-transactions',
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

  // chat
  // { path: '/customer-support', component: Chats },
  {
    path: '/customer-support/chats-by-single-order/:id',
    component: ChatsListByOrder,
  },
  { path: '/customer-support/details/:id', component: ChatDetails },

  // admin control
  { path: '/admin/list', component: AdminControl },
  { path: '/admin/create', component: CreateAdmin },
  { path: '/admin/edit/:id', component: CreateAdmin },
  { path: '/admin/role', component: Role },

  { path: '/percentage-setting', component: PercentageSettings2 },

  //  settings
  { path: '/app/settings', component: AppSettings },
  { path: '/testing', component: AdminSettings2 },
  { path: '/settings/app-settings', component: Appsettings2 },
  { path: '/admin/settings2', component: AdminSettings },
  { path: '/admin/percentage-settings-history', component: AdminLog },
  { path: '/settings/refer-friend', component: ReferFriend },
  { path: '/settings/cancel-reason', component: CancelReason2 },
  { path: '/admin/default-chat-message', component: DefaultChat2 },
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
  { path: '/settings/ratings', component: RatingSettings2 },
  { path: '/settings/categories/list', component: CategoryList2 },

  // terms and conditions
  { path: '/terms-and-conditions', component: TermsAndConditions },
  { path: '/privacy', component: PrivacySettings },

  { path: '/admin/settings/zone', component: ServiceZone },

  // Chat Reason
  { path: '/settings/support-reasons', component: Faq2 },

  // NOTIFICATIONS
  { path: '/settings/notifications', component: Notification },

  // DISPLAY
  { path: '/display', component: DisplaySettings },
  { path: '/display/list-containers', component: ListContainers },
  { path: '/display/filter-containers', component: FilterContainers },
  { path: '/display/tags-cusines', component: TagsAndCusines },
  { path: '/display/banner', component: AdBanner },
  { path: '/display/banner/add', component: AddBanner },
  { path: '/display/banner/edit/:id', component: AddBanner },
  { path: '/admin/requested-area', component: RequestedArea },

  // tickets
  { path: '/tickets', component: Tickets },
];
