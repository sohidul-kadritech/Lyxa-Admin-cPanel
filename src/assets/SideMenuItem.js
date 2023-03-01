export const adminMenuItem = [
  {
    name: 'Dashboard',
    icon: 'fas fa-list',
    link: '/dashboard',
    isSubmenu: false,
  },
  {
    name: 'Orders',
    icon: 'fas fa-cart-plus',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        icon: 'fas fa-cart-plus',
        name: 'All Orders',
        link: '/orders/list',
        isSubmenu: false,
      },
      {
        icon: 'fas fa-cart-plus',
        name: 'Cancelled Orders',
        link: '/orders/refused',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Butler',
    icon: 'fas fa-truck',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        icon: 'fas fa-cart-plus',
        name: 'All Orders',
        link: '/butler/list',
        isSubmenu: false,
      },
      {
        icon: 'fas fa-cart-plus',
        name: 'Cancelled Orders',
        link: '/butler/list/canceled',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Banner',
    icon: 'fas fa-image',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/banner',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/banner/add',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'User',
    icon: 'fas fa-user-friends',
    link: '/users/list',
    isSubmenu: false,
  },
  {
    name: 'Sellers',
    icon: 'fas fa-user-friends',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/seller/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/seller/add',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Shops',
    icon: 'fas fa-home',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/shops/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/shops/add',
        isSubmenu: false,
      },
      {
        name: 'Cuisines',
        icon: 'fas fa-clipboard-list',
        link: '/shops/cuisines',
        isSubmenu: false,
      },
      {
        name: 'Tags',
        icon: 'fas fa-clipboard-list',
        link: '/shops/tags',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Products',
    icon: 'fa fa-cube',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/products/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/products/add',
        isSubmenu: false,
      },
      {
        name: 'Unit Types',
        icon: 'fa fa-cube',
        link: '/products/unit-types',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Delivery Boy',
    icon: 'fas fa-user-friends',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/deliveryman/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/deliveryman/add',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Deals',
    icon: 'fas fa-handshake',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/deals/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/deals/add',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Lyxa Pay',
    icon: 'fas fa-comment-dollar',
    link: '/lyxa-pay',
    isSubmenu: false,
  },
  {
    name: 'App Wallet',
    icon: 'fas fa-wallet',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'Seller TRX',
        icon: 'fas fa-exchange-alt',
        link: '/add-wallet/seller-transactions',
        isSubmenu: false,
      },
      {
        name: 'Delivery TRX',
        icon: 'fas fa-exchange-alt',
        link: '/add-wallet/delivery-transactions',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Transactions',
    icon: 'fas fa-comment-dollar',
    link: '/admin/transactions',
    isSubmenu: false,
  },
  {
    name: 'Notifications',
    icon: 'fas fa-bell',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/admin/notifications/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/admin/send-notifications',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Chat',
    icon: 'fas fa-comment-dollar',
    link: '/customer-support',
    isSubmenu: false,
    badgeId: 'sidebar-item-chat-badges',
  },
  {
    name: 'VAT',
    icon: 'fas fa-clipboard-list',
    link: '/vat',
    isSubmenu: false,
  },
  {
    name: 'Admins',
    icon: 'fas fa-user-friends',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/admin/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/admin/create',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Categories',
    icon: 'fas fa-list',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/categories/list',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Marketing',
    icon: 'fas fa-cart-plus',
    link: '/marketing',
    isSubmenu: false,
  },
  {
    id: 14,
    name: 'FAQ',
    icon: 'fas fa-list',
    link: '/faq',
    isSubmenu: false,
  },
  {
    id: 17,
    name: 'Terms and Conditions',
    icon: 'ti-settings',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'User App',
        icon: 'ti-settings',
        link: '/terms-and-conditions/user-app',
        isSubmenu: false,
      },
      {
        name: 'Shop App',
        icon: 'ti-settings',
        link: '/terms-and-conditions/shop-app',
        isSubmenu: false,
      },
      {
        name: 'Delivery App',
        icon: 'ti-settings',
        link: '/terms-and-conditions/delivery-app',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Settings',
    icon: 'ti-settings',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'Admin',
        icon: 'ti-settings',
        link: '/admin/settings',
        isSubmenu: false,
      },
      {
        name: 'App',
        icon: 'ti-settings',
        link: '/app/settings',
        isSubmenu: false,
      },
      {
        name: 'Percentage Setting',
        icon: 'ti-settings',
        link: '/percentage-setting',
        isSubmenu: false,
      },
      {
        name: 'Admin Log',
        icon: 'fas fa-exchange-alt',
        link: '/admin/percentage-settings-history',
        isSubmenu: false,
      },
      {
        name: 'Default Message',
        icon: 'fas fa-exchange-alt',
        link: '/admin/default-chat-message',
        isSubmenu: false,
      },
      {
        name: 'Support Reasons',
        icon: 'fas fa-comment-dollar',
        link: '/settings/support-reasons',
        isSubmenu: false,
      },
      {
        icon: 'fas fa-times',
        name: 'Cancel Reason',
        link: '/admin/cancel-reason',
        isSubmenu: false,
      },
      {
        name: 'Database Collection',
        icon: 'fas fa-exchange-alt',
        link: '/admin/database/collections',
        isSubmenu: false,
      },
    ],
  },
];

export const customerServiceMenuItem = [
  {
    name: 'Orders',
    icon: 'fas fa-cart-plus',
    link: '/orders/list',
    isSubmenu: false,
  },
  {
    name: 'Users',
    icon: 'fas fa-user-friends',
    link: '/users/list',
    isSubmenu: false,
  },
  {
    name: 'Sellers',
    icon: 'fas fa-user-friends',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/seller/list',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Shops',
    icon: 'fas fa-home',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/shops/list',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Delivery Boy',
    icon: 'fas fa-user-friends',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/deliveryman/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/deliveryman/add',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Lyxa Pay',
    icon: 'fas fa-comment-dollar',
    link: '/drop-pay',
    isSubmenu: false,
  },
  {
    name: 'Chat',
    icon: 'fas fa-comment-dollar',
    link: '/customer-support',
    isSubmenu: false,
  },
];

export const sellerMenuItem = [
  {
    name: 'Dashboard',
    icon: 'ti-home',
    link: '/dashboard',
    isSubmenu: false,
  },
  {
    name: 'Orders',
    icon: 'fas fa-cart-plus',
    link: '/orders/list',
    isSubmenu: false,
  },
  {
    name: 'Shops',
    icon: 'fas fa-home',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/shops/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/shops/add',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Products',
    icon: 'fa fa-cube',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/products/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/products/add',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'App Wallet',
    icon: 'fas fa-wallet',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'Shops TRX',
        icon: 'fas fa-exchange-alt',
        link: `/app-wallet/seller/shops-transactions`,
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Marketing',
    icon: 'fas fa-cart-plus',
    link: '/marketing',
    isSubmenu: false,
  },
  {
    name: 'Credentials',
    icon: 'fas fa-user-friends',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/seller/credentials/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/admin/create',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Categories',
    icon: 'fas fa-list',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/categories/list',
        isSubmenu: false,
      },
    ],
  },
];

export const shopMenuItem = [
  {
    name: 'Dashboard',
    icon: 'ti-home',
    link: '/dashboard',
    isSubmenu: false,
  },
  {
    name: 'Orders',
    icon: 'fas fa-cart-plus',
    link: '/orders/list',
    isSubmenu: false,
  },
  {
    name: 'My Shop',
    icon: 'fas fa-home',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/shops/list',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Products',
    icon: 'fa fa-cube',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/products/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/products/add',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'App Wallet',
    icon: 'fas fa-wallet',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'Shop TRX',
        icon: 'fas fa-exchange-alt',
        link: '/add-wallet/shop-transactions',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Marketing',
    icon: 'fas fa-cart-plus',
    link: '/marketing',
    isSubmenu: false,
  },
  {
    name: 'Credentials',
    icon: 'fas fa-user-friends',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/shop/credentials/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/admin/create',
        isSubmenu: false,
      },
    ],
  },
  {
    name: 'Categories',
    icon: 'fas fa-list',
    link: '/#',
    isSubmenu: true,
    submenu: [
      {
        name: 'List',
        icon: 'fas fa-clipboard-list',
        link: '/categories/list',
        isSubmenu: false,
      },
      {
        name: 'Add',
        icon: 'fas fa-plus-circle',
        link: '/categories/add',
        isSubmenu: false,
      },
    ],
  },
];
