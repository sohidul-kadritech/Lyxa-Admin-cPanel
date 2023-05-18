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

export const customer_service_routes = (prefix = '') => [
  // orders
  { path: `${prefix}/orders/list`, component: OrdersList },
  { path: `${prefix}/orders/details/:id`, component: OrderDetails },
  // users
  { path: `${prefix}/users/list`, component: UsersList },
  { path: `${prefix}/users/details/:id`, component: UserDetails },
  { path: `${prefix}/seller/list`, component: SellerList },
  { path: `${prefix}/seller/details/:id`, component: SellerDetails },
  { path: `${prefix}/shops/list`, component: ShopList },
  { path: `${prefix}/shops/details/:id`, component: ShopDetails },
  { path: `${prefix}/deliveryman/list`, component: DeliverymanList },
  { path: `${prefix}/deliveryman/details/:id`, component: DeliverymanDetails },
  { path: `${prefix}/deliveryman/add`, component: DeliverymanAdd },
  { path: `${prefix}/drop-pay`, component: DropPayList },
  { path: `${prefix}/customer-support`, component: Chats },
  {
    path: `${prefix}/customer-support/chats-by-single-order/:id`,
    component: ChatsListByOrder,
  },
  { path: `${prefix}/customer-support/details/:id`, component: ChatDetails },
  // this route should be at the end of all other routes
  { path: `${prefix}/`, exact: true, component: () => <Redirect to="/orders/list" /> },
];
