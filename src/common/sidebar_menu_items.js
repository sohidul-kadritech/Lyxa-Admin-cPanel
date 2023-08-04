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
import { ReactComponent as UserIcon } from '../assets/icons/menu-icons/user.svg';
import { ReactComponent as UsersIcon } from '../assets/icons/menu-icons/users.svg';

/* ======== shop ======== */
export const shop_menu_items = (prefix = '', shopDeliveryType, shopType) => {
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

  if (shopType !== 'food') {
    menuItems[2].menu[0].label = 'Product List';
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
        to: '/orders',
      },
      {
        label: 'Sellers',
        to: '/seller/list',
        icon: SellersIcon,
      },
      {
        label: 'Shops',
        to: '/shop',
        icon: ShopIcon,
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
        label: 'Display',
        to: '/display',
        icon: DisplayIcon,
      },
      {
        label: 'Chat New',
        to: '/tickets',
        icon: ChatIcon,
      },
      {
        label: 'Chat',
        to: '/customer-support',
        icon: ChatIcon,
        badgeId: 'sidebar-item-chat-badges',
      },
    ],
  },
];

export const account_manager_menu_items = [
  {
    title: 'Management',
    menu: [
      {
        label: 'Dashboard',
        icon: DashBoardIcon,
        to: '/',
      },

      {
        label: 'Sellers',
        to: '/seller/list',
        icon: SellersIcon,
      },
    ],
  },
];

export const sales_manager_menu_items = [
  {
    title: 'Management',
    menu: [
      {
        label: 'Dashboard',
        icon: DashBoardIcon,
        to: '/',
      },

      {
        label: 'Sellers',
        to: '/seller/list',
        icon: SellersIcon,
      },
    ],
  },
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
        label: 'Accounts',
        to: '/accounts',
        icon: UserIcon,
        SellersIcon,
      },
      {
        label: 'Sellers',
        to: '/seller/list',
        icon: SellersIcon,
      },
      // {
      //   label: 'Lyxa Pay TRX ',
      //   to: '/lyxa-pay',
      //   icon: TrxIcon,
      // },
    ],
  },
];
