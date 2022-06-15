// export const API_URL = "http://localhost:5000";
// export const FTP_URL = "http://localhost:1000";

export const API_URL = "https://node.drop-deliveryapp.com/";
// export const SOCKET_CONNECTION = "https://node.drop-deliveryapp.com";


const ADMIN_ENDPOINT = "admin";

// ADMIN API

// LOGIN API

export const LOGIN = ADMIN_ENDPOINT + "/auth/login";


// GET IMAGE
export const GET_GALLERY_LIST = ADMIN_ENDPOINT + "/image";

// banner
export const BANNER_LIST = ADMIN_ENDPOINT + "/banner";
export const ADD_BANNER = ADMIN_ENDPOINT + "/banner/add";
export const DELETE_BANNER = ADMIN_ENDPOINT + "/banner/delete";
export const GET_SINGLE_BANNER = ADMIN_ENDPOINT + "/banner/";
export const EDIT_BANNER = ADMIN_ENDPOINT + "/banner/update";



// ADMIN 

export const ADD_ADMIN = ADMIN_ENDPOINT + "/admins/add-admin";
export const GET_ALL_ADMIN = ADMIN_ENDPOINT + "/admins/";
export const DELETE_ADMIN = ADMIN_ENDPOINT + "/admins/delete";
export const EDIT_ADMIN = ADMIN_ENDPOINT + "/admins/update";
export const SINGLE_ADMIN = ADMIN_ENDPOINT + "/admins/get-single-admin-details";

// CHANGE PASSWORD

export const CHANGE_PASSWORD = ADMIN_ENDPOINT + "/admins/change-password";

// ROLE

export const ADD_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/add";
export const GET_ALL_ADMIN_ROLE = ADMIN_ENDPOINT + "/role";
export const EDIT_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/edit";
export const DELETE_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/delete";
export const RESTORE_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/restore";



// USERS

export const ALL_USERS = ADMIN_ENDPOINT +  "/user";
export const SINGLE_USER = ADMIN_ENDPOINT + "/user/get-user-details";
export const USER_TRANSACTIONS = ADMIN_ENDPOINT + "/user/get-user-transaction";


// CATEGORY 
export const ADD_CATEGORY = ADMIN_ENDPOINT + "/category/add-category";
export const GET_ALL_CATEGORY = ADMIN_ENDPOINT + "/category";
export const SINGLE_CATEGORY = ADMIN_ENDPOINT + "/category/get-single-category";
export const EDIT_CATEGORY = ADMIN_ENDPOINT + "/category/update";

// SUB CATEGORY 
export const ADD_SUB_CATEGORY = ADMIN_ENDPOINT + "/sub-category/add";
export const EDIT_SUB_CATEGORY = ADMIN_ENDPOINT + "/sub-category/update";
export const GET_ALL_SUB_CATEGORY = ADMIN_ENDPOINT + "/sub-category/get-all-subcategory-by-category-id"
export const DELETE_SUB_CAT = ADMIN_ENDPOINT + "/sub-category/delete"

// SELLER 
export const ADD_SELLER = ADMIN_ENDPOINT + "/seller/add";
export const ALL_SELLER = ADMIN_ENDPOINT + "/seller";
export const EDIT_SELLER = ADMIN_ENDPOINT + "/seller/update";
export const DELETE_SELLER = ADMIN_ENDPOINT + "/seller/delete";
export const SINGLE_SELLER = ADMIN_ENDPOINT + "/seller/get-seller-details"

// SHOP 

export const ADD_SHOP_DEAL = ADMIN_ENDPOINT + "/shop/add-deal"
export const ADD_SHOP = ADMIN_ENDPOINT + "/shop/add"
export const EDIT_SHOP = ADMIN_ENDPOINT + "/shop/update"
export const ALL_SHOP = ADMIN_ENDPOINT + "/shop"
export const DELETE_SHOP = ADMIN_ENDPOINT + "/shop/delete"
export const SINGLE_SHOP = ADMIN_ENDPOINT + "/shop/get-shop-details"
export const SHOP_LIVE_STATUS = ADMIN_ENDPOINT + "/shop/shop-visibility-change"
export const ADD_CUISINE = ADMIN_ENDPOINT + "/cuisines/add";
export const ALL_CUISINE = ADMIN_ENDPOINT + "/cuisines";
export const EDIT_CUISINE = ADMIN_ENDPOINT + "/cuisines/update";

// PRODUCT 

export const ADD_PRODUCT = ADMIN_ENDPOINT + "/product/add"
export const ALL_PRODUCT = ADMIN_ENDPOINT + "/product"
export const EDIT_PRODUCT = ADMIN_ENDPOINT + "/product/update"
export const SINGLE_PRODUCT = ADMIN_ENDPOINT + "/product/product-details"
export const DELETE_PRODUCT = ADMIN_ENDPOINT + "/product/delete"
export const ADD_PRODUCT_DEAL = ADMIN_ENDPOINT + "/product/add-deal"

// DELIVERY MAN 

export const ADD_DELIVERY_MAN = ADMIN_ENDPOINT + "/delivery-boy/add"
export const ALL_DELIVERY_MAN = ADMIN_ENDPOINT + "/delivery-boy"
export const SINGLE_DELIVERY_MAN = ADMIN_ENDPOINT + "/delivery-boy/get-single-delivery-boy"
export const EDIT_DELIVERY_MAN = ADMIN_ENDPOINT + "/delivery-boy/update"


//  SETTINGS 

export const ADMINS_SETTINGS = '/admin/setting/admin-setting'
export const UPDATE_ADMINS_SETTINGS = '/admin/setting/admin-setting/edit';

export const UPDATE_APP_SETTINGS = '/admin/setting/app-setting/edit'
export const APP_SETTINGS = '/admin/setting/app-setting'

// DEAL 

export const ADD_DEAL = ADMIN_ENDPOINT + "/deal/add"
export const GET_ALL_DEAL = ADMIN_ENDPOINT + "/deal"
export const EDIT_DEAL = ADMIN_ENDPOINT + "/deal/edit"
export const DELETE_DEAL = ADMIN_ENDPOINT + "/deal/delete"
export const SINGLE_DEAL = ADMIN_ENDPOINT + "/deal/"
export const ALL_DEAL_FOR_ADD = ADMIN_ENDPOINT + "/deal/get-deals-for-add"
export const ALL_TAG = ADMIN_ENDPOINT + "/deal/get-tags"

// DROP PAY

export const DROP_PAY_LIST = ADMIN_ENDPOINT + "/drop-pay"
export const ADD_USER_BALANCE = ADMIN_ENDPOINT + "/user/add-balance"
export const REMOVE_USER_BALANCE = ADMIN_ENDPOINT + "/user/withdraw-balance"

// APP WALLET



export const SET_DELIVERY_FEE = ADMIN_ENDPOINT + "/setting/delivery-charge"
export const GET_DELIVERY_FEE = ADMIN_ENDPOINT + "/setting/get-global-delivery-charge";
export const SELLER_TRX = ADMIN_ENDPOINT + "/wallet/seller"
export const DELIVERY_TRX = ADMIN_ENDPOINT + "/wallet/delivery-boy"
export const DROP_TRX = ADMIN_ENDPOINT + "/wallet/admin"




// ORDERS

export const ORDER_LIST = ADMIN_ENDPOINT + "/order";

// CHAT

export const CHAT_LIST = ADMIN_ENDPOINT + "/user-chat-request"
export const ACCEPT_CHAT = ADMIN_ENDPOINT + "/user-chat-request/accept";


// IMAGE UPLOAD 

export const IMAGE_UPLOAD = "image/single-image-upload"

// END ADMIN API
