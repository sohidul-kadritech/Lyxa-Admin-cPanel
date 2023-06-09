/* eslint-disable default-param-last */
import { ReactComponent as AdminOrdersIcon } from '../assets/icons/menu-icons/admin-orders.svg';
import { ReactComponent as ChatIcon } from '../assets/icons/menu-icons/chat.svg';
import { ReactComponent as HoursIcon } from '../assets/icons/menu-icons/clock.svg';
import { ReactComponent as DashBoardIcon } from '../assets/icons/menu-icons/dashboard.svg';
import { ReactComponent as DisplayIcon } from '../assets/icons/menu-icons/display.svg';
import { ReactComponent as FinanceAdminIcon } from '../assets/icons/menu-icons/finance-admin.svg';
import { ReactComponent as FinancialIcon } from '../assets/icons/menu-icons/financials.svg';
import { ReactComponent as MarketingIcon } from '../assets/icons/menu-icons/marketing.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menu-icons/menu.svg';
import { ReactComponent as OngoingTickets } from '../assets/icons/menu-icons/ongoing-ticket.svg';
import { ReactComponent as OrderIcon } from '../assets/icons/menu-icons/order.svg';
import { ReactComponent as PastTickets } from '../assets/icons/menu-icons/past-tickets.svg';
import { ReactComponent as ProfileIcon } from '../assets/icons/menu-icons/profile.svg';
import { ReactComponent as RidersAdminIcons } from '../assets/icons/menu-icons/riders.svg';
import { ReactComponent as SellersIcon } from '../assets/icons/menu-icons/sellers.svg';
import { ReactComponent as SettingsAdminIcon } from '../assets/icons/menu-icons/settings-admin.svg';
import { ReactComponent as SettingsIcon } from '../assets/icons/menu-icons/settings.svg';
import { ReactComponent as ShopListIcon } from '../assets/icons/menu-icons/shop-list.svg';
import { ReactComponent as ShopIcon } from '../assets/icons/menu-icons/shop.svg';
import { ReactComponent as TeamIcon } from '../assets/icons/menu-icons/team.svg';
import { ReactComponent as TrxIcon } from '../assets/icons/menu-icons/trx.svg';
import { ReactComponent as UserIcon } from '../assets/icons/menu-icons/user.svg';
import { ReactComponent as UsersIcon } from '../assets/icons/menu-icons/users.svg';

/* ======== shop ======== */
export const shop_menu_items = (prefix = '', shopDeliveryType) => {
  console.log({ shopDeliveryType, prefix });
  const menuItems = [
    {
      title: 'Management',
      menu: [
        {
          label: 'Dashboard',
          icon: DashBoardIcon,
          to: `${prefix}/`,
        },
        {
          label: 'Marketing',
          icon: MarketingIcon,
          to: `${prefix}/marketing`,
        },
        {
          label: 'Financials',
          icon: FinancialIcon,
          to: `${prefix}/financials`,
        },
      ],
    },
    {
      title: 'Ordering Details',
      menu: [
        {
          label: 'Order',
          icon: OrderIcon,
          to: `${prefix}/new-orders`,
        },

        {
          label: 'Settings',
          icon: SettingsIcon,
          to: `${prefix}/settings`,
        },
      ],
    },
    {
      title: 'Restaurant Profile',
      menu: [
        {
          label: 'Menu',
          icon: MenuIcon,
          to: `${prefix}/menu`,
        },
        {
          label: 'Profile',
          icon: ProfileIcon,
          to: `${prefix}/profile`,
        },
        {
          label: 'Hours',
          icon: HoursIcon,
          to: `${prefix}/hours`,
        },
        {
          label: 'Users',
          icon: UsersIcon,
          to: `${prefix}/users`,
        },
      ],
    },
    // {
    //   title: 'No Icons',
    //   menu: [
    // {
    //   label: 'Driver Rating',
    //   icon: RatingIcon,
    //   to: `${prefix}/`,
    // },
    //     {
    //       label: 'My Shop',
    //       to: `${prefix}/shops/list`,
    //     },
    //     {
    //       label: 'Menu Old',
    //       to: `${prefix}/products/list`,
    //     },
    //     {
    //       label: 'App Wallet',
    //       to: `${prefix}/add-wallet/shop-transactions`,
    //     },
    //     {
    //       label: 'Credentials',
    //       to: `${prefix}/shop/credentials/list`,
    //     },
    //     {
    //       label: 'Categories Old',
    //       to: `${prefix}/categories/list`,
    //     },
    //     {
    //       label: 'Old Orders',
    //       to: `${prefix}/orders/list`,
    //     },
    //     {
    //       label: 'Zone',
    //       to: `${prefix}/shop/zone`,
    //     },
    //     {
    //       label: 'Old Dashboard',
    //       icon: DashBoardIcon,
    //       to: `${prefix}/dashboard`,
    //     },
    //   ],
    // },
  ];

  if (shopDeliveryType === 'self') {
    menuItems[1].menu.push({
      label: 'Riders',
      to: `${prefix}/riders`,
      icon: RidersAdminIcons,
    });
  }

  return menuItems;
};

/* ======== seller ======== */
export const seller_menu_items = (prefix = '') => [
  {
    title: 'Management',
    menu: [
      {
        label: 'Dashboard',
        to: `${prefix}/`,
        icon: DashBoardIcon,
      },
      {
        label: 'Shop List',
        to: `${prefix}/shops/list`,
        icon: ShopListIcon,
      },
      {
        label: 'Financials',
        icon: FinancialIcon,
        to: `${prefix}/financials`,
      },
      {
        label: 'Orders',
        to: `${prefix}/orders/list`,
        icon: OrderIcon,
      },

      {
        label: 'Users',
        icon: UsersIcon,
        to: `${prefix}/users`,
      },
    ],
  },
  // {
  //   title: 'Shop',
  //   menu: [
  //     // {
  //     //   label: 'Shop Add',
  //     //   to: `${prefix}/shops/add`,
  //     // },
  //   ],
  // },
  // {
  //   title: 'Arbiatry',
  //   menu: [
  //     {
  //       label: 'Shops TRX',
  //       to: `${prefix}/app-wallet/seller/shops-transactions`,
  //     },
  //     {
  //       label: 'Categories List',
  //       to: `${prefix}/categories/list`,
  //     },
  //   ],
  // },
];

/* ======== admin ======== */
export const admin_menu_items = [
  {
    title: 'Management',
    menu: [
      {
        label: 'Dashboard',
        icon: DashBoardIcon,
        to: '/',
      },
      {
        label: 'Orders',
        icon: AdminOrdersIcon,
        to: '/new-orders',
      },
      {
        label: 'Sellers',
        to: '/seller/list',
        icon: SellersIcon,
      },
      {
        label: 'Sellers2',
        to: '/seller/list2',
        icon: SellersIcon,
      },
      {
        label: 'Shops',
        to: '/shops/list',
        icon: ShopIcon,
      },
      {
        label: 'Shops New',
        to: '/shop',
        icon: ShopIcon,
      },
      {
        label: 'Users',
        to: '/users/list',
        icon: UsersIcon,
      },
      {
        label: 'Accounts',
        to: '/accounts',
        icon: UsersIcon,
      },
      {
        label: 'Riders',
        to: '/riders',
        icon: RidersAdminIcons,
      },
      {
        label: 'Settings',
        to: '/settings',
        icon: SettingsAdminIcon,
      },
      {
        label: 'Financials',
        to: '/financials',
        icon: FinanceAdminIcon,
      },
      {
        label: 'Team',
        to: '/admin/list',
        icon: TeamIcon,
      },
      {
        label: 'Team2',
        to: '/admin/list2',
        icon: TeamIcon,
      },
      {
        label: 'Display',
        to: '/display',
        icon: DisplayIcon,
      },
      {
        label: 'Chat',
        to: '/customer-support',
        icon: ChatIcon,
        badgeId: 'sidebar-item-chat-badges',
      },
    ],
  },
  // {
  //   title: 'Order',
  //   menu: [
  //     {
  //       label: 'Cancelled Orders',
  //       to: '/orders/list/cancel',
  //     },
  //     {
  //       label: 'Flagged Orders',
  //       to: '/orders/list/flagged',
  //       badgeId: 'sidebar-item-flagged-orders',
  //     },
  //   ],
  // },
  // {
  //   title: 'Sellers & Shop',
  //   menu: [
  //     {
  //       label: 'Sellers Add',
  //       to: '/seller/add',
  //     },

  //     {
  //       label: 'Shops Add',
  //       to: '/shops/add',
  //     },
  //   ],
  // },
  // {
  //   title: 'Products',
  //   menu: [
  //     {
  //       label: 'Products List',
  //       to: '/products/list',
  //     },
  //     {
  //       label: 'Product Add',
  //       to: '/products/add',
  //     },
  //     {
  //       label: 'Unit Types',
  //       to: '/products/unit-types',
  //     },
  //   ],
  // },
  // {
  //   title: 'User & Delivery',
  //   menu: [
  //     {
  //       label: 'Delivery Boy Add',
  //       to: '/deliveryman/add',
  //     },
  //   ],
  // },
  // {
  //   title: 'Finance',
  //   menu: [
  //     {
  //       label: 'Lyxa Pay',
  //       to: '/lyxa-pay',
  //     },
  //     {
  //       label: 'Seller TRX',
  //       to: '/add-wallet/seller-transactions',
  //     },
  //     {
  //       label: 'Delivery TRX',
  //       to: '/add-wallet/delivery-transactions',
  //     },
  //     {
  //       label: 'Transactions',
  //       to: '/admin/transactions',
  //     },
  //   ],
  // },
  // {
  //   title: 'Notification & Chat',
  //   menu: [
  //     {
  //       label: 'Notifications List',
  //       to: '/admin/notifications/list',
  //     },
  //     {
  //       label: 'Notifications List2',
  //       to: '/admin/notifications',
  //     },
  //     {
  //       label: 'Notifications Add',
  //       to: '/admin/send-notifications',
  //     },
  //     {
  //       label: 'Chat',
  //       to: '/customer-support',
  //       badgeId: 'sidebar-item-chat-badges',
  //     },
  //   ],
  // },
  // {
  //   title: 'Terms & Conditions',
  //   menu: [
  //     {
  //       label: 'Terms And Conditions2',
  //       to: '/terms-and-conditions2',
  //     },
  //     {
  //       label: 'User App',
  //       to: '/terms-and-conditions/user-app',
  //     },
  //     {
  //       label: 'Shop App',
  //       to: '/terms-and-conditions/shop-app',
  //     },
  //     {
  //       label: 'Delivery App',
  //       to: '/terms-and-conditions/delivery-app',
  //     },
  //   ],
  // },
  // {
  //   title: 'Settings',
  //   menu: [
  //     {
  //       label: 'Admin Settings',
  //       to: '/admin/settings',
  //     },
  //     {
  //       label: 'App Settings',
  //       to: '/app/settings',
  //     },
  //     {
  //       label: 'App Settings2',
  //       to: '/app/settings2',
  //     },
  //     {
  //       label: 'Percentage Settings',
  //       to: '/percentage-setting',
  //     },
  //     {
  //       label: 'Reward Settings',
  //       to: '/admin/settings/reward-settings',
  //     },
  //     {
  //       label: 'Default Message',
  //       to: '/admin/default-chat-message',
  //     },
  //     {
  //       label: 'Support Reasons',
  //       to: '/settings/support-reasons',
  //     },
  //     {
  //       label: 'Cancel Order Reason',
  //       to: '/admin/cancel-reason',
  //     },
  //     {
  //       label: 'Cancel Order Reason2',
  //       to: '/admin/cancel-reason2',
  //     },
  //     {
  //       label: 'Support Reasons2',
  //       to: '/settings/support-reasons2',
  //     },
  //     {
  //       label: 'Zone',
  //       to: '/admin/zone',
  //     },
  //     {
  //       label: 'Requested Area',
  //       to: '/admin/requested-area',
  //     },
  //     {
  //       label: 'Database Collection',
  //       to: '/admin/database/collections',
  //     },
  //   ],
  // },
  // {
  //   title: 'Need Design',
  //   menu: [
  //     {
  //       label: 'Admin Settings',
  //       to: '/admin/settings2',
  //     },
  //     {
  //       label: 'Deals List',
  //       to: '/deals/list',
  //     },
  //     {
  //       label: 'Deals Add',
  //       to: '/deals/add',
  //     },
  //     {
  //       label: 'VAT',
  //       to: '/vat',
  //     },
  //     {
  //       label: 'Admins List',
  //       to: '/admin/list',
  //     },
  //     {
  //       label: 'Admins Add',
  //       to: '/admin/create',
  //     },
  //     {
  //       label: 'Categories List',
  //       to: '/settings/categories/list',
  //     },
  //     {
  //       label: 'Admin Log',
  //       to: '/admin/percentage-settings-history',
  //     },
  //     {
  //       label: 'Ratings',
  //       to: '/settings/ratings',
  //     },
  //     {
  //       label: 'Ratings2',
  //       to: '/settings/ratings2',
  //     },
  //     {
  //       label: 'Cancel Reason',
  //       to: '/admin/cancel-reason',
  //     },
  //   ],
  // },
];

export const customer_service_menu_items = [
  {
    title: 'Management',
    menu: [
      {
        label: 'Ongoing Tickets',
        icon: OngoingTickets,
        to: '/ongoing-tickets',
      },
      {
        label: 'Past Tickets',
        icon: PastTickets,
        to: '/past-tickets',
      },
      {
        label: 'All Orders',
        icon: AdminOrdersIcon,
        to: '/orders',
      },
      {
        label: 'Riders',
        to: '/riders',
        icon: RidersAdminIcons,
      },
      {
        label: 'User',
        to: '/users',
        icon: UserIcon,
        SellersIcon,
      },
      {
        label: 'Sellers',
        to: '/deliveryman/list',
        icon: SellersIcon,
      },
      {
        label: 'Lyxa Pay TRX ',
        to: '/transactions',
        icon: TrxIcon,
      },
    ],
  },
  {
    title: 'Sellers & Shop',
    menu: [
      {
        label: 'Delivery Boy List',
        to: '/deliveryman/list',
      },
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
