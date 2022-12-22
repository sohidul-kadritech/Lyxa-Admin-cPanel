import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";
import uploadImageReducer from "./reducer/uploadImage.reducer";

//Calendar
import calendar from "./calendar/reducer";
import galleryReducer from "./reducer/imageGallery.reducer";
import imageReducer from "./reducer/image/imageFolder.reducer";
import folderCreateReducer from "./reducer/image/folderCreate.reducer";
import bannerReducer from "./banner/bannerReducer";
import { roleReducer } from "./AdminControl/Role/roleReducer";
import usersReducer from "./Users/UsersReducer";
import adminReducer from "./AdminControl/Admin/adminReducer";
import categoryReducer from "./Category/categoryReducer";
import sellerReducer from "./Seller/sellerReducer";
import shopReducer from "./Shop/shopReducer";
import imageUploadReducer from "./ImageUpload/imageUploadReducer";
import productReducer from "./Product/productReducer";
import deliveryManReducer from "./DeliveryMan/DeliveryManReducer";
import settingsReducer from "./Settings/settingsReducer";
import dealReducer from "./Deal/dealReducer";
import dropPayReducer from "./DropPay/dropPayReducer";
import appWalletReducer from "./appWallet/appWalletReducer";
import orderReducer from "./order/orderReducer";
import chatReducer from "./chat/chatReducer";
import socketReducer from "./socket/socketReducer";
import unitTypeReducer from "./unitType/unitTypeReducer";
import notificationReducer from "./Notification/notificationReducer";
import termsAndConditonReducer from "./termsAndConditions/termsAndConditionReducer";
import dashboardReducer from "./Dashboard/dashboardReducer";

const rootReducer = combineReducers({
  // public
  Layout,
  Login: Login,
  Account,
  ForgetPassword,
  Profile,
  calendar,
  uploadImage: uploadImageReducer,
  galleryReducer: galleryReducer,
  imageReducer,
  createFolder: folderCreateReducer,
  dashboardReducer,
  bannerReducer,
  roleReducer,
  usersReducer,
  adminReducer,
  categoryReducer,
  sellerReducer,
  shopReducer,
  imageUploadReducer,
  productReducer,
  deliveryManReducer,
  settingsReducer,
  dealReducer,
  dropPayReducer,
  appWalletReducer,
  orderReducer,
  chatReducer,
  socketReducer,
  unitTypeReducer,
  notificationReducer,
  termsAndConditonReducer,
});

export default rootReducer;
