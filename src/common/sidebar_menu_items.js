import { ReactComponent as HoursIcon } from '../assets/icons/menu-icons/clock.svg';
import { ReactComponent as DashBoardIcon } from '../assets/icons/menu-icons/dashboard.svg';
import { ReactComponent as FinancialIcon } from '../assets/icons/menu-icons/financials.svg';
import { ReactComponent as MarketingIcon } from '../assets/icons/menu-icons/marketing.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menu-icons/menu.svg';
import { ReactComponent as OrderIcon } from '../assets/icons/menu-icons/order.svg';
import { ReactComponent as ProfileIcon } from '../assets/icons/menu-icons/profile.svg';
import { ReactComponent as SettingsIcon } from '../assets/icons/menu-icons/settings.svg';
import { ReactComponent as RatingIcon } from '../assets/icons/menu-icons/star.svg';
import { ReactComponent as UsersIcon } from '../assets/icons/menu-icons/usrs.svg';

/* ======== shop ======== */
export const shop_menu_items = [
  {
    title: 'Management',
    menu: [
      {
        label: 'Dashboard',
        icon: DashBoardIcon,
        to: '/new-dashboard',
      },
      {
        label: 'Marketing',
        icon: MarketingIcon,
        to: '/marketing',
      },
      // {
      //   label: 'Services',
      //   icon: ServicesIcon,
      //   to: '/',
      // },
      {
        label: 'Financials',
        icon: FinancialIcon,
        to: '/financials',
      },
    ],
  },
  {
    title: 'Ordering Details',
    menu: [
      {
        label: 'Order',
        icon: OrderIcon,
        to: '/new-orders',
      },
      {
        label: 'Driver Rating',
        icon: RatingIcon,
        to: '/',
      },
      {
        label: 'Settings',
        icon: SettingsIcon,
        to: '/shop/settings',
      },
    ],
  },
  {
    title: 'Restaurant Profile',
    menu: [
      {
        label: 'Menu',
        icon: MenuIcon,
        to: '/products/list2',
      },
      {
        label: 'Profile',
        icon: ProfileIcon,
        to: '/profile',
      },
      {
        label: 'Hours',
        icon: HoursIcon,
        to: '/hours',
      },
      {
        label: 'Users',
        icon: UsersIcon,
        to: '/shop/users',
      },
    ],
  },
  {
    title: 'No Icons',
    menu: [
      {
        label: 'My Shop',
        to: '/shops/list',
      },
      {
        label: 'Menu Old',
        to: '/products/list',
      },
      {
        label: 'App Wallet',
        to: '/add-wallet/shop-transactions',
      },
      {
        label: 'Credentials',
        to: '/shop/credentials/list',
      },
      {
        label: 'Categories Old',
        to: '/categories/list',
      },
      {
        label: 'Old Orders',
        to: '/orders/list',
      },
      {
        label: 'Zone',
        // icon: ShopZone,
        to: '/shop/zone',
      },
      {
        label: 'Old Dashboard',
        icon: DashBoardIcon,
        to: '/dashboard',
      },
    ],
  },
];

/* ======== seller ======== */
export const seller_menu_items = [
  {
    title: 'Management',
    menu: [
      {
        label: 'Dashboard',
        to: '/dashboard',
      },
      {
        label: 'Orders',
        to: '/orders/list',
      },
    ],
  },
  {
    title: 'Shop',
    menu: [
      {
        label: 'Shop List',
        to: '/shops/list',
      },
      {
        label: 'Shop Add',
        to: '/shops/add',
      },
    ],
  },
  {
    title: 'Products',
    menu: [
      {
        label: 'List',
        to: '/products/list',
      },
      {
        label: 'Add',
        to: '/products/add',
      },
    ],
  },
  {
    title: 'Arbiatry',
    menu: [
      {
        label: 'Shops TRX',
        to: `/app-wallet/seller/shops-transactions`,
      },
      {
        label: 'Categories List',
        to: '/seller/credentials/list',
      },
      {
        label: 'Categories Add',
        to: '/admin/create',
      },
      {
        label: 'List',
        to: '/categories/list',
      },
    ],
  },
];

/* ======== admin ======== */
export const admin_menu_items = [
  {
    title: 'Management',
    menu: [
      {
        label: 'Dashboard',
        icon: DashBoardIcon,
        to: '/dashboard',
      },
    ],
  },
  {
    title: 'Order',
    menu: [
      {
        label: 'Orders',
        icon: OrderIcon,
        to: '/orders/list',
      },
      {
        label: 'Cancelled Orders',
        to: '/orders/list/cancel',
      },
      {
        label: 'Flagged Orders',
        to: '/orders/list/flagged',
        badgeId: 'sidebar-item-flagged-orders',
      },
    ],
  },
  {
    title: 'Sellers & Shop',
    menu: [
      {
        label: 'Sellers List',
        to: '/seller/list',
      },

      {
        label: 'Sellers Add',
        to: '/seller/add',
      },

      {
        label: 'Shops List',
        to: '/shops/list',
      },
      {
        label: 'Shops Add',
        to: '/shops/add',
      },
    ],
  },
  {
    title: 'Products',
    menu: [
      {
        label: 'Products List',
        to: '/products/list',
      },
      {
        label: 'Product Add',
        to: '/products/add',
      },
      {
        label: 'Unit Types',
        to: '/products/unit-types',
      },
    ],
  },
  {
    title: 'User & Delivery',
    menu: [
      {
        label: 'User',
        to: '/users/list',
      },
      {
        label: 'Delivery Boy List',
        to: '/deliveryman/list',
      },
      {
        label: 'Delivery Boy Add',
        to: '/deliveryman/add',
      },
    ],
  },
  {
    title: 'Finance',
    menu: [
      {
        label: 'Lyxa Pay',
        to: '/lyxa-pay',
      },
      {
        label: 'Seller TRX',
        to: '/add-wallet/seller-transactions',
      },
      {
        label: 'Delivery TRX',
        to: '/add-wallet/delivery-transactions',
      },
      {
        label: 'Transactions',
        to: '/admin/transactions',
      },
    ],
  },
  {
    title: 'Notification & Chat',
    menu: [
      {
        label: 'Notifications List',
        to: '/admin/notifications/list',
      },
      {
        label: 'Notifications Add',
        to: '/admin/send-notifications',
      },
      {
        label: 'Chat',
        to: '/customer-support',
        badgeId: 'sidebar-item-chat-badges',
      },
    ],
  },
  {
    title: 'Terms & Conditions',
    menu: [
      {
        label: 'User App',
        to: '/terms-and-conditions/user-app',
      },
      {
        label: 'Shop App',
        to: '/terms-and-conditions/shop-app',
      },
      {
        label: 'Delivery App',
        to: '/terms-and-conditions/delivery-app',
      },
    ],
  },
  {
    title: 'Settings',
    menu: [
      {
        label: 'Settings',
        to: '/admin/settings2',
      },
      {
        label: 'Admin Settings',
        to: '/admin/settings',
      },
      {
        label: 'App Settings',
        to: '/app/settings',
      },
      {
        label: 'Percentage Settings',
        to: '/percentage-setting',
      },
      // {
      //   label: 'Reward Settings',
      //   to: '/admin/settings/reward-settings',
      // },
      {
        label: 'Default Message',
        to: '/admin/default-chat-message',
      },
      {
        label: 'Support Reasons',
        to: '/settings/support-reasons',
      },
      {
        label: 'Zone',
        to: '/admin/zone',
      },
      {
        label: 'Database Collection',
        to: '/admin/database/collections',
      },
    ],
  },
  {
    title: 'Need Design',
    menu: [
      {
        label: 'Deals List',
        to: '/deals/list',
      },
      {
        label: 'Deals Add',
        to: '/deals/add',
      },
      {
        label: 'VAT',
        to: '/vat',
      },
      {
        label: 'Admins List',
        to: '/admin/list',
      },
      {
        label: 'Admins Add',
        to: '/admin/create',
      },
      {
        label: 'Categories List',
        to: '/categories/list',
      },

      {
        label: 'Display',
        to: '/display',
      },
      {
        label: 'Admin Log',
        to: '/admin/percentage-settings-history',
      },
      {
        label: 'Ratings',
        to: '/settings/ratings',
      },
      {
        label: 'Cancel Reason',
        to: '/admin/cancel-reason',
      },
    ],
  },
];

export const customer_service_menu_items = [
  {
    title: 'User & Delivery',
    menu: [
      {
        label: 'User',
        to: '/users/list',
      },
      {
        label: 'Delivery Boy List',
        to: '/deliveryman/list',
      },
    ],
  },
  {
    title: 'Sellers & Shop',
    menu: [
      {
        label: 'Sellers List',
        to: '/seller/list',
      },

      {
        label: 'Shops List',
        to: '/shops/list',
      },
    ],
  },
  {
    title: 'No Icons',
    menu: [
      {
        label: 'Orders',
        to: '/orders/list',
      },
      {
        label: 'Drop Pay',
        to: '/drop-pay',
      },
      {
        label: 'Chat',
        to: '/customer-support',
        badgeId: 'sidebar-item-chat-badges',
      },
    ],
  },
];
