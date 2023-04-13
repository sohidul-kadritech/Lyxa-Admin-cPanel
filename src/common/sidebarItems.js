import { ReactComponent as HoursIcon } from '../assets/icons/menu-icons/clock.svg';
import { ReactComponent as DashBoardIcon } from '../assets/icons/menu-icons/dashboard.svg';
import { ReactComponent as FinancialIcon } from '../assets/icons/menu-icons/financials.svg';
import { ReactComponent as MarketingIcon } from '../assets/icons/menu-icons/marketing.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menu-icons/menu.svg';
import { ReactComponent as OrderIcon } from '../assets/icons/menu-icons/order.svg';
import { ReactComponent as ProfileIcon } from '../assets/icons/menu-icons/profile.svg';
import { ReactComponent as ServicesIcon } from '../assets/icons/menu-icons/services.svg';
import { ReactComponent as SettingsIcon } from '../assets/icons/menu-icons/settings.svg';
import { ReactComponent as RatingIcon } from '../assets/icons/menu-icons/star.svg';
import { ReactComponent as UsersIcon } from '../assets/icons/menu-icons/usrs.svg';

export const shop_menu_items = [
  {
    title: 'Management',
    menu: [
      {
        label: 'Dashboard',
        icon: DashBoardIcon,
        to: '/dashboard',
      },
      {
        label: 'Marketing',
        icon: MarketingIcon,
        to: '/marketing',
      },
      {
        label: 'Services',
        icon: ServicesIcon,
        to: '/',
      },
      {
        label: 'Financials',
        icon: FinancialIcon,
        to: '/',
      },
    ],
  },
  {
    title: 'Ordering Details',
    menu: [
      {
        label: 'Order',
        icon: OrderIcon,
        to: '/orders/list',
      },
      {
        label: 'Driver Rating',
        icon: RatingIcon,
        to: '/',
      },
      {
        label: 'Settings',
        icon: SettingsIcon,
        to: '/',
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
        to: '/',
      },
      {
        label: 'Hours',
        icon: HoursIcon,
        to: '/',
      },
      {
        label: 'Users',
        icon: UsersIcon,
        to: '/',
      },
    ],
  },
];
