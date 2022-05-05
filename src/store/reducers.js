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
import adminReducer from './AdminControl/Admin/adminReducer';
import categoryReducer from "./Category/categoryReducer";
import sellerReducer from './Seller/sellerReducer';
import shopReducer from "./Shop/shopReducer";
import imageUploadReducer from "./ImageUpload/imageUploadReducer";
import productReducer from "./Product/productReducer";
import deliveryManReducer from "./DeliveryMan/DeliveryManReducer";

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
  bannerReducer,
  roleReducer,
  usersReducer,
  adminReducer,
  categoryReducer,
  sellerReducer,
  shopReducer,
  imageUploadReducer,
  productReducer,
  deliveryManReducer
});

export default rootReducer;
