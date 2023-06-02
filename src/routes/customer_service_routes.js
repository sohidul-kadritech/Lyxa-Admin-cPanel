import { Redirect } from 'react-router-dom';
import DeliverymanAdd from '../pages/Deliveryman/DeliverymanAdd/DeliverymanAdd';
import DeliverymanList from '../pages/Deliveryman/DeliverymanList/DeliverymanList';
import DropPayList from '../pages/DropPay/DropPayList/DropPayList';
import OrdersList from '../pages/Orders/OrdersList/OrdersList';
import SellerList from '../pages/Seller/SellerList/SellerList';
import ShopList from '../pages/Shops/ShopList/ShopList';
import UserDetails from '../pages/Users/UserDetails/UserDetails';
import UsersList from '../pages/Users/UsersList/UsersList';

import ChatDetails from '../pages/Chat/ChatDetails/ChatDetails';
import DeliverymanDetails from '../pages/Deliveryman/DeliverymanDetails/DeliverymanDetails';
import OrderDetails from '../pages/Orders/OrderDetails/OrderDetails';
import SellerDetails from '../pages/Seller/SellerDetails/SellerDetails';
import ShopDetails from '../pages/Shops/ShopDetails/ShopDetails';

import Chats from '../pages/Chat/Chats';
import ChatsListByOrder from '../pages/Chat/ChatsListByOrder/ChatsListByOrder';
import OngoingTickets from '../pages/OngoingTickets';
import PastTickets from '../pages/PastTickets';
import RiderProfile from '../pages/RiderProfile';
import RiderList from '../pages/Riders';

export const customer_service_routes = [
  { path: `/ongoing-tickets`, component: OngoingTickets },
  { path: `/past-tickets`, component: PastTickets },
  { path: `/riders`, component: () => <RiderList viewUserType="admin" /> },
  { path: `/riders/:riderId`, component: RiderProfile },
  { path: `/orders/list`, component: OrdersList },
  { path: `/orders/details/:id`, component: OrderDetails },
  { path: `/users/list`, component: UsersList },
  { path: `/users/details/:id`, component: UserDetails },
  { path: `/seller/list`, component: SellerList },
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
  { path: `/`, exact: true, component: () => <Redirect to="/orders/list" /> },
];
