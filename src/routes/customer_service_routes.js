import { Redirect } from 'react-router-dom';
import AdminOrders from '../pages/AdminOrderTable';
import DeliverymanAdd from '../pages/Deliveryman/DeliverymanAdd/DeliverymanAdd';
import DeliverymanList from '../pages/Deliveryman/DeliverymanList/DeliverymanList';
import DropPayList from '../pages/DropPay/DropPayList/DropPayList';
import OrdersList from '../pages/Orders/OrdersList/OrdersList';
import ShopList from '../pages/Shops/ShopList/ShopList';
import UserDetails from '../pages/Users/UserDetails/UserDetails';
import UsersList from '../pages/Users/UsersList/UsersList';

import ChatDetails from '../pages/Chat/ChatDetails/ChatDetails';
import DeliverymanDetails from '../pages/Deliveryman/DeliverymanDetails/DeliverymanDetails';
import OrderDetails from '../pages/Orders/OrderDetails/OrderDetails';
import SellerDetails from '../pages/Seller/SellerDetails/SellerDetails';
import ShopDetails from '../pages/Shops/ShopDetails/ShopDetails';

import AdminToSellerLayout from '../components/Layout/ChildLayouts/AdminToSellerLayout';
import SellerToShopLayout from '../components/Layout/ChildLayouts/SellerToShopLayout';
import AccountList from '../pages/Accounts';
import AccountFinancials from '../pages/AppWallet2/ForAccount';
import Chats from '../pages/Chat/Chats';
import ChatsListByOrder from '../pages/Chat/ChatsListByOrder/ChatsListByOrder';
import OngoingTickets from '../pages/OngoingTickets';
import PastTickets from '../pages/PastTickets';
import RiderProfile from '../pages/RiderProfile';
import RiderList from '../pages/Riders';
import SellerList2 from '../pages/Sellers2';
import ShopProfile from '../pages/ShopProfile';
import UserProfile from '../pages/UsersProfile';

export const customer_service_routes = [
  { path: `/ongoing-tickets`, component: OngoingTickets },
  { path: `/past-tickets`, component: PastTickets },

  { path: `/riders`, component: RiderList, componentProps: { viewUserType: 'admin' } },
  { path: `/riders/:riderId`, component: RiderProfile },

  { path: `/orders`, component: AdminOrders },

  { path: `/accounts`, component: AccountList },
  { path: '/accounts/:userId', component: UserProfile },

  { path: '/seller/list', component: SellerList2 },
  { path: '/seller/list/:sellerId', component: SellerList2 },
  { path: '/seller/dashboard/:sellerId', component: AdminToSellerLayout, exact: false },

  { path: '/lyxa-pay', component: AccountFinancials },

  { path: '/shop/profile/:shopId', component: ShopProfile },
  { path: '/shop/dashboard/:shopId', component: SellerToShopLayout, exact: false },

  { path: `/orders/list`, component: OrdersList },
  { path: `/orders/details/:id`, component: OrderDetails },
  { path: `/users/list`, component: UsersList },
  { path: `/users/details/:id`, component: UserDetails },
  { path: `/seller/details/:id`, component: SellerDetails },
  { path: `/shops/list`, component: ShopList },
  { path: `/shops/details/:id`, component: ShopDetails },
  { path: `/deliveryman/list`, component: DeliverymanList },
  { path: `/deliveryman/details/:id`, component: DeliverymanDetails },
  { path: `/deliveryman/add`, component: DeliverymanAdd },
  { path: `/drop-pay`, component: DropPayList },
  { path: `/customer-support`, component: Chats },
  {
    path: `/customer-support/chats-by-single-order/:id`,
    component: ChatsListByOrder,
  },
  { path: `/customer-support/details/:id`, component: ChatDetails },
  // this route should be at the end of all other routes
  { path: `/`, exact: true, component: () => <Redirect to="/ongoing-tickets" /> },
];
