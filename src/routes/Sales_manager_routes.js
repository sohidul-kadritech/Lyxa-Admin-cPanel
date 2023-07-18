// User List
import Marketing from '../pages/Marketing';
import SellerAdd from '../pages/Seller/SellerAdd/SellerAdd';
// import ShopAdd from '../pages/Shops/ShopAdd/ShopAdd';

import SellerDetails from '../pages/Seller/SellerDetails/SellerDetails';
// import ShopDetails from '../pages/Shops/ShopDetails/ShopDetails';

import MarketingDashboard from '../pages/Marketing/Dashbaord';

import AdminToSellerLayout from '../components/Layout/ChildLayouts/AdminToSellerLayout';
import SellerToShopLayout from '../components/Layout/ChildLayouts/SellerToShopLayout';
import SalesManagerDashBoard from '../pages/SalesManagerDashBoard';
import SellerList2 from '../pages/Sellers2';
import ShopProfile from '../pages/ShopProfile';

export const sales_manager_routes = [
  // dashboard
  { path: '/', component: SalesManagerDashBoard },

  // sellers
  { path: '/seller/list', component: SellerList2 },
  { path: '/seller/list/:sellerId', component: SellerList2 },
  { path: '/seller/add', component: SellerAdd },
  { path: '/seller/edit/:id', component: SellerAdd },
  { path: '/seller/details/:id', component: SellerDetails },
  { path: '/seller/dashboard/:sellerId', component: AdminToSellerLayout, exact: false },

  // shops
  // { path: '/shops/list', component: ShopList, componentProps: { viewUserType: 'admin' } },
  // { path: '/shops/details/:id', component: ShopDetails },
  { path: '/shops/:id/marketing/', component: Marketing, componentProps: { viewUserType: 'admin' } },
  {
    path: '/shops/:shopId/marketing/dashboard/:type/:id',
    component: MarketingDashboard,
    componentProps: { viewUserType: 'admin' },
  },

  // { path: '/shop', component: AdminShopList },
  { path: '/shop/profile/:shopId', component: ShopProfile },
  { path: '/shop/dashboard/:shopId', component: SellerToShopLayout, exact: false },

  // { path: '/financials', component: AdminFinancials },

  // { path: '/orders', component: AdminOrders },

  // { path: '/orders/list', component: ButlerOrderList },
  // { path: '/orders/details/regular/:id', component: OrderDetails },
  // { path: '/orders/details/butler/:id', component: ButlerOrderDetails },
  // { path: '/orders/list/cancel', component: ButlerCancelOrders },
  // { path: '/orders/list/flagged', component: ButlerFlaggedOrder },

  // // vat
  // { path: '/vat2', component: Vat },
  // { path: '/vat', component: Vat2 },
  // { path: '/riders', component: RiderList, componentProps: { viewUserType: 'admin' } },
  // { path: `/riders/:riderId`, component: RiderProfile },

  // // users
  // { path: '/accounts', component: AccountList },
  // { path: '/accounts/:userId', component: UserProfile },
  // { path: '/users/details/:id', component: UserDetails },
  // { path: '/users/transactions/:id', component: UserTransaction },

  // // product
  // { path: '/products/list2', component: ProductList },
  // { path: '/settings/products', component: Product },
  // { path: '/products/add', component: ProductAdd },
  // { path: '/products/edit/:id', component: ProductAdd },
  // { path: '/products/details/:id', component: ProductDetails },
  // { path: '/products/unit-types', component: UnitTypes },

  // // delivery man
  // { path: '/deliveryman/list', component: DeliverymanList },
  // { path: '/deliveryman/add', component: DeliverymanAdd },
  // { path: '/deliveryman/edit/:id', component: DeliverymanAdd },
  // { path: '/deliveryman/details/:id', component: DeliverymanDetails },

  // // deals
  // { path: '/deals/list', component: DealsList },
  // { path: '/deals/add', component: DealsAdd },
  // { path: '/deals/edit/:id', component: DealsAdd },

  // // drop pay

  // { path: '/lyxa-pay', component: AccountFinancials },

  // // app wallet
  // { path: '/add-wallet/admin-log-history', component: AdminLogs },

  // { path: '/add-wallet/seller-transactions', component: FinancialsForSeller },

  // {
  //   path: '/app-wallet/seller/shops-transactions',
  //   component: ShopsFinancialsSpecificSellers,
  // },

  // {
  //   path: '/add-wallet/shop-transactions',
  //   component: ShopFinancialsTransaction,
  // },

  // // for rider
  // {
  //   path: '/add-wallet/delivery-transactions',
  //   component: RidersTransactions,
  // },
  // {
  //   path: '/add-wallet/single-delivery-transactions/:id',
  //   component: SingleDeliveryTransactions,
  // },
  // { path: '/add-wallet/payments-history', component: PaymentHistory },
  // { path: '/add-wallet/drop-transactions', component: DropTransactions },
  // {
  //   path: '/add-wallet/drop-transactions/details/:id',
  //   component: DropTransactionsDetails,
  // },
  // { path: '/admin/transactions', component: Transactions },

  // // chat
  // { path: '/customer-support', component: Chats },
  // {
  //   path: '/customer-support/chats-by-single-order/:id',
  //   component: ChatsListByOrder,
  // },
  // { path: '/customer-support/details/:id', component: ChatDetails },

  // // catagories and tags
  // { path: '/tags/list', component: TagsList },
  // { path: '/tags/add', component: TagAdd },

  // // admin control
  // // { path: '/admin/list', component: AdminList },
  // { path: '/admin/list', component: AdminControl },
  // { path: '/admin/create', component: CreateAdmin },
  // { path: '/admin/edit/:id', component: CreateAdmin },
  // { path: '/admin/role', component: Role },

  // { path: '/percentage-setting', component: PercentageSettings2 },

  // //  settings
  // { path: '/app/settings', component: AppSettings },
  // { path: '/testing', component: AdminSettings2 },

  // { path: '/settings/app-settings', component: Appsettings2 },
  // { path: '/admin/settings2', component: AdminSettings },
  // { path: '/admin/percentage-settings-history', component: AdminLog },
  // { path: '/settings/refer-friend', component: ReferFriend },
  // { path: '/admin/cancel-reason', component: CancelReason },
  // { path: '/settings/cancel-reason', component: CancelReason2 },
  // { path: '/admin/default-chat-message', component: DefaultChat2 },
  // { path: '/admin/database/collections', component: DatabaseSettings },

  // // settings
  // { path: '/settings', component: AdminSettings2 },

  // // marketing
  // { path: '/settings/marketing', component: AdminMarketingSettings },
  // { path: '/settings/marketing/loyalty', component: AdminLoyaltySettings },
  // { path: '/settings/marketing/deals', component: AdminDealSettings },
  // { path: '/settings/marketing/featured', component: AdminFeaturedSettings },
  // { path: '/settings/marketing/coupons', component: CouponSettings },
  // { path: '/settings/zone', component: ServiceZone },
  // { path: '/settings/products/list', component: ProductList },
  // { path: '/settings/products/add', component: ProductAdd },
  // { path: '/settings/products/edit/:id', component: ProductAdd },
  // { path: '/settings/products/details/:id', component: ProductDetails },
  // { path: '/settings/products/unit-types', component: UnitTypes },
  // { path: '/settings/ratings', component: RatingSettings2 },
  // { path: '/settings/categories/list', component: CategoryList2 },
  // { path: '/settings/categories/edit/:id', component: CategoryAdd },
  // { path: '/settings/category/details/:id', component: CategoryDetails },

  // // terms and conditions
  // { path: '/terms-and-conditions', component: TermsAndConditions },
  // { path: '/privacy', component: PrivacySettings },

  // { path: '/admin/settings/zone', component: ServiceZone },

  // // Chat Reason
  // { path: '/settings/support-reasons2', component: Faq },
  // { path: '/settings/support-reasons', component: Faq2 },
  // { path: '/settings/ratings2', component: RatingSettings },

  // // NOTIFICATIONS
  // { path: '/admin/send-notifications', component: SendNotifications },
  // { path: '/admin/notifications/list', component: NotificationsList },
  // { path: '/settings/notifications', component: Notification },

  // // DISPLAY
  // { path: '/display', component: DisplaySettings },
  // { path: '/display/list-containers', component: ListContainers },
  // { path: '/display/filter-containers', component: FilterContainers },
  // { path: '/display/tags-cusines', component: TagsAndCusines },
  // // { path: '/display/banner', component: BannerPage },
  // { path: '/display/banner', component: AdBanner },
  // { path: '/display/banner/add', component: AddBanner },
  // { path: '/display/banner/edit/:id', component: AddBanner },
  // { path: '/admin/requested-area', component: RequestedArea },
];
