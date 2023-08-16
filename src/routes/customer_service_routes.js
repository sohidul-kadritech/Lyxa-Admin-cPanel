import { Redirect } from 'react-router-dom';
import AdminToSellerLayout from '../components/Layout/ChildLayouts/AdminToSellerLayout';
import SellerToShopLayout from '../components/Layout/ChildLayouts/SellerToShopLayout';
import AccountList from '../pages/Accounts';
import AdminOrders from '../pages/AdminOrderTable';
import ChatDetails from '../pages/Chat/ChatDetails/ChatDetails';
import Chats from '../pages/Chat/Chats';
import ChatsListByOrder from '../pages/Chat/ChatsListByOrder/ChatsListByOrder';
import OngoingTickets from '../pages/OngoingTickets';
import PastTickets from '../pages/PastTickets';
import RiderProfile from '../pages/RiderProfile';
import RiderList from '../pages/Riders';
import SellerDetails from '../pages/Seller/SellerDetails/SellerDetails';
import SellerList2 from '../pages/Sellers2';
import ShopProfile from '../pages/ShopProfile';
import UserProfile from '../pages/UsersProfile';

export const customer_service_routes = [
  { path: `/ongoing-tickets`, component: OngoingTickets },
  { path: `/past-tickets`, component: PastTickets },

  { path: `/riders`, component: RiderList, componentProps: { viewUserType: 'admin' } },
  { path: `/riders/:riderId`, component: RiderProfile },

  { path: `/orders`, component: AdminOrders },

  { path: `/users`, component: AccountList },
  { path: '/users/:userId', component: UserProfile },

  { path: '/seller/list', component: SellerList2 },
  { path: '/seller/list/:sellerId', component: SellerList2 },
  { path: '/seller/dashboard/:sellerId', component: AdminToSellerLayout, exact: false },

  { path: '/shop/profile/:shopId', component: ShopProfile },
  { path: '/shop/dashboard/:shopId', component: SellerToShopLayout, exact: false },

  { path: `/seller/details/:id`, component: SellerDetails },
  { path: `/customer-support`, component: Chats },
  {
    path: `/customer-support/chats-by-single-order/:id`,
    component: ChatsListByOrder,
  },
  { path: `/customer-support/details/:id`, component: ChatDetails },
  // this route should be at the end of all other routes
  { path: `/`, exact: true, component: () => <Redirect to="/ongoing-tickets" /> },
];
