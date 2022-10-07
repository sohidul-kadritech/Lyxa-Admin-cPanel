export const adminMenuItem = [
  {
    id: 1,
    name: "Dashboard",
    icon: "fas fa-list",
    link: "/dashboard",
    isSubmenu: false,
  },
  {
    id: 2,
    name: "Orders",
    icon: "fas fa-cart-plus",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 20,
        icon: "fas fa-cart-plus",
        name: "All Orders",
        link: "/orders/list",
        isSubmenu: false,
      },
      {
        id: 21,
        icon: "fas fa-cart-plus",
        name: "Cancelled Orders",
        link: "/orders/refused",
        isSubmenu: false,
      },
      {
        id: 22,
        icon: "fas fa-times",
        name: "Cancel Reason",
        link: "/orders/cancel-reason",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 3,
    name: "Banner",
    icon: "fas fa-user-friends",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 30,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/banner",
        isSubmenu: false,
      },
      {
        id: 31,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/banner/add",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 4,
    name: "User",
    icon: "fas fa-user-friends",
    link: "/users/list",
    isSubmenu: false,
  },
  {
    id: 5,
    name: "Sellers",
    icon: "fas fa-user-friends",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 50,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/seller/list",
        isSubmenu: false,
      },
      {
        id: 51,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/seller/add",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 6,
    name: "Shops",
    icon: "fas fa-home",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 60,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/shops/list",
        isSubmenu: false,
      },
      {
        id: 61,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/shops/add",
        isSubmenu: false,
      },
      {
        id: 62,
        name: "Cuisines",
        icon: "fas fa-clipboard-list",
        link: "/shops/cuisines",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 7,
    name: "Products",
    icon: "fa fa-cube",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 70,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/products/list",
        isSubmenu: false,
      },
      {
        id: 71,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/products/add",
        isSubmenu: false,
      },
      {
        id: 72,
        name: "Unit Types",
        icon: "fa fa-cube",
        link: "/products/unit-types",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 8,
    name: "Delivery Boy",
    icon: "fas fa-user-friends",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 80,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/deliveryman/list",
        isSubmenu: false,
      },
      {
        id: 81,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/deliveryman/add",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 9,
    name: "Deals",
    icon: "fas fa-handshake",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 90,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/deals/list",
        isSubmenu: false,
      },
      {
        id: 91,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/deals/add",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 10,
    name: "Drop Pay",
    icon: "fas fa-comment-dollar",
    link: "/drop-pay",
    isSubmenu: false,
  },
  {
    id: 11,
    name: "App Wallet",
    icon: "fas fa-wallet",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 111,
        name: "Seller TRX",
        icon: "fas fa-exchange-alt",
        link: "/add-wallet/seller-transactions",
        isSubmenu: false,
      },
      {
        id: 112,
        name: "Delivery TRX",
        icon: "fas fa-exchange-alt",
        link: "/add-wallet/delivery-transactions",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 16,
    name: "Transactions",
    icon: "fas fa-comment-dollar",
    link: "/admin/transactions",
    isSubmenu: false,
  },
  {
    id: 18,
    name: "Notifications",
    icon: "fas fa-bell",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 180,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/admin/notifications/list",
        isSubmenu: false,
      },
      {
        id: 181,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/admin/send-notifications",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 12,
    name: "Chat",
    icon: "fas fa-comment-dollar",
    link: "/customer-support",
    isSubmenu: false,
  },
  {
    id: 13,
    name: "Admins",
    icon: "fas fa-user-friends",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 130,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/admin/list",
        isSubmenu: false,
      },
      {
        id: 131,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/admin/create",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 14,
    name: "Categories",
    icon: "fas fa-list",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 140,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/categories/list",
        isSubmenu: false,
      },
      {
        id: 141,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/categories/add",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 15,
    name: "Settings",
    icon: "ti-settings",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 150,
        name: "Admin",
        icon: "ti-settings",
        link: "/admin/settings",
        isSubmenu: false,
      },
      {
        id: 151,
        name: "App",
        icon: "ti-settings",
        link: "/app/settings",
        isSubmenu: false,
      },
      {
        id: 152,
        name: "Percentage Setting",
        icon: "ti-settings",
        link: "/percentage-setting",
        isSubmenu: false,
      },
      {
        id: 153,
        name: "Admin Log",
        icon: "fas fa-exchange-alt",
        link: "/admin/percentage-settings-history",
        isSubmenu: false,
      },
      {
        id: 154,
        name: "Default Message",
        icon: "fas fa-exchange-alt",
        link: "/admin/default-chat-message",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 17,
    name: "Terms and Conditions",
    icon: "ti-settings",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 170,
        name: "User App",
        icon: "ti-settings",
        link: "/terms-and-conditions/user-app",
        isSubmenu: false,
      },
      {
        id: 171,
        name: "Shop App",
        icon: "ti-settings",
        link: "/terms-and-conditions/shop-app",
        isSubmenu: false,
      },
      {
        id: 172,
        name: "Delivery App",
        icon: "ti-settings",
        link: "/terms-and-conditions/delivery-app",
        isSubmenu: false,
      },
    ],
  },
];

export const customerServiceMenuItem = [
  {
    id: 1,
    name: "Orders",
    icon: "fas fa-cart-plus",
    link: "/orders/list",
    isSubmenu: false,
  },
  {
    id: 2,
    name: "Users",
    icon: "fas fa-user-friends",
    link: "/users/list",
    isSubmenu: false,
  },
  {
    id: 3,
    name: "Sellers",
    icon: "fas fa-user-friends",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 30,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/seller/list",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 4,
    name: "Shops",
    icon: "fas fa-home",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 40,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/shops/list",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 5,
    name: "Delivery Boy",
    icon: "fas fa-user-friends",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 50,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/deliveryman/list",
        isSubmenu: false,
      },
      {
        id: 51,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/deliveryman/add",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 6,
    name: "Drop Pay",
    icon: "fas fa-comment-dollar",
    link: "/drop-pay",
    isSubmenu: false,
  },
  {
    id: 7,
    name: "Chat",
    icon: "fas fa-comment-dollar",
    link: "/customer-support",
    isSubmenu: false,
  },
];

export const sellerMenuItem = [
  {
    id: 1,
    name: "Dashboard",
    icon: "ti-home",
    link: "/dashboard",
    isSubmenu: false,
  },
  {
    id: 2,
    name: "Orders",
    icon: "fas fa-cart-plus",
    link: "/orders/list",
    isSubmenu: false,
  },
  {
    id: 7,
    name: "Shops",
    icon: "fas fa-home",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 70,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/shops/list",
        isSubmenu: false,
      },
      {
        id: 71,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/shops/add",
        isSubmenu: false,
      },

    ],
  },
  {
    id: 3,
    name: "Products",
    icon: "fa fa-cube",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 30,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/products/list",
        isSubmenu: false,
      },
      {
        id: 31,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/products/add",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 4,
    name: "App Wallet",
    icon: "fas fa-wallet",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 41,
        name: "Shops TRX",
        icon: "fas fa-exchange-alt",
        link: `/app-wallet/seller/shops-transactions`,
        isSubmenu: false,
      },
    ],
  },
  {
    id: 5,
    name: "Credentials",
    icon: "fas fa-user-friends",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 50,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/seller/credentials/list",
        isSubmenu: false,
      },
      {
        id: 51,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/admin/create",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 6,
    name: "Categories",
    icon: "fas fa-list",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 60,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/categories/list",
        isSubmenu: false,
      },
      {
        id: 61,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/categories/add",
        isSubmenu: false,
      },
    ],
  },
];

export const shopMenuItem = [
  {
    id: 1,
    name: "Dashboard",
    icon: "ti-home",
    link: "/dashboard",
    isSubmenu: false,
  },
  {
    id: 2,
    name: "Orders",
    icon: "fas fa-cart-plus",
    link: "/orders/list",
    isSubmenu: false,
  },
  {
    id: 3,
    name: "Products",
    icon: "fa fa-cube",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 30,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/products/list",
        isSubmenu: false,
      },
      {
        id: 31,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/products/add",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 4,
    name: "App Wallet",
    icon: "fas fa-wallet",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 41,
        name: "Shop TRX",
        icon: "fas fa-exchange-alt",
        link: `/add-wallet/shop-transactions`,
        isSubmenu: false,
      },
    ],
  },
  {
    id: 5,
    name: "Credentials",
    icon: "fas fa-user-friends",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 50,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/shop/credentials/list",
        isSubmenu: false,
      },
      {
        id: 51,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/admin/create",
        isSubmenu: false,
      },
    ],
  },
  {
    id: 6,
    name: "Categories",
    icon: "fas fa-list",
    link: "/#",
    isSubmenu: true,
    submenu: [
      {
        id: 60,
        name: "List",
        icon: "fas fa-clipboard-list",
        link: "/categories/list",
        isSubmenu: false,
      },
      {
        id: 61,
        name: "Add",
        icon: "fas fa-plus-circle",
        link: "/categories/add",
        isSubmenu: false,
      },
    ],
  },
];
