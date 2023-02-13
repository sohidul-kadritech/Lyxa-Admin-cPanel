import { combineReducers } from 'redux';

// Front
import Layout from './layout/reducer';

// Authentication
import ForgetPassword from './auth/forgetpwd/reducer';
import Login from './auth/login/reducer';
import Profile from './auth/profile/reducer';
import uploadImageReducer from './reducer/uploadImage.reducer';

// Calendar
import adminReducer from './AdminControl/Admin/adminReducer';
import { roleReducer } from './AdminControl/Role/roleReducer';
import appWalletReducer from './appWallet/appWalletReducer';
import bannerReducer from './banner/bannerReducer';
import calendar from './calendar/reducer';
import categoryReducer from './Category/categoryReducer';
import chatReducer from './chat/chatReducer';
import dashboardReducer from './Dashboard/dashboardReducer';
import dealReducer from './Deal/dealReducer';
import deliveryManReducer from './DeliveryMan/DeliveryManReducer';
import dropPayReducer from './DropPay/dropPayReducer';
import imageUploadReducer from './ImageUpload/imageUploadReducer';
import notificationReducer from './Notification/notificationReducer';
import orderReducer from './order/orderReducer';
import productReducer from './Product/productReducer';
import folderCreateReducer from './reducer/image/folderCreate.reducer';
import imageReducer from './reducer/image/imageFolder.reducer';
import galleryReducer from './reducer/imageGallery.reducer';
import sellerReducer from './Seller/sellerReducer';
import settingsReducer from './Settings/settingsReducer';
import shopReducer from './Shop/shopReducer';
import socketReducer from './socket/socketReducer';
import termsAndConditonReducer from './termsAndConditions/termsAndConditionReducer';
import unitTypeReducer from './unitType/unitTypeReducer';
import usersReducer from './Users/UsersReducer';

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  appWalletReducer,
  adminReducer,
  bannerReducer,
  calendar,
  chatReducer,
  categoryReducer,
  createFolder: folderCreateReducer,
  dealReducer,
  dropPayReducer,
  deliveryManReducer,
  dashboardReducer,
  ForgetPassword,
  galleryReducer,
  imageReducer,
  imageUploadReducer,
  notificationReducer,
  orderReducer,
  Profile,
  productReducer,
  roleReducer,
  sellerReducer,
  settingsReducer,
  socketReducer,
  shopReducer,
  termsAndConditonReducer,
  uploadImage: uploadImageReducer,
  usersReducer,
  unitTypeReducer,
});

export default rootReducer;
