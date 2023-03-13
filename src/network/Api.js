export const API_URL = 'https://apiv2.drop-deliveryapp.com/';
export const SOCKET_CONNECTION = 'https://apiv2.drop-deliveryapp.com';
export const MAP_URL = 'http://maps.google.com/maps';

const ADMIN_ENDPOINT = 'admin';

export const LOGIN = `${ADMIN_ENDPOINT}/auth/login`;
export const FORGET_PASS = `${API_URL}forget`;

// GET IMAGE
export const GET_GALLERY_LIST = `${ADMIN_ENDPOINT}/image`;

// dasboard

export const GET_DASHBOARD_SUMMARY = `${ADMIN_ENDPOINT}/dashboard`;
export const GET_SELLER_DASHBOARD_SUMMARY = `${ADMIN_ENDPOINT}/dashboard/seller`;
export const GET_SHOP_DASHBOARD_SUMMARY = `${ADMIN_ENDPOINT}/dashboard/shop`;

export const ADMIN_DASHBOARD_USERS_GRAPH = `${ADMIN_ENDPOINT}/dashboard/graph/users`;

export const ADMIN_DASHBOARD_ORDER_GRAPH = `${ADMIN_ENDPOINT}/dashboard/graph/orders`;
export const SELLER_DASHBOARD_ORDER_GRAPH = `${ADMIN_ENDPOINT}/dashboard/seller/graph/orders`;
export const SHOP_DASHBOARD_ORDER_GRAPH = `${ADMIN_ENDPOINT}/dashboard/shop/graph/orders`;

export const ADMIN_DASHBOARD_EARNING_GRAPH = `${ADMIN_ENDPOINT}/dashboard/graph/earnings`;
export const SELLER_DASHBOARD_EARNING_GRAPH = `${ADMIN_ENDPOINT}/dashboard/seller/graph/earnings`;
export const SHOP_DASHBOARD_EARNING_GRAPH = `${ADMIN_ENDPOINT}/dashboard/shop/graph/earnings`;

// banner
export const BANNER_LIST = `${ADMIN_ENDPOINT}/banner`;
export const ADD_BANNER = `${ADMIN_ENDPOINT}/banner/add`;
export const DELETE_BANNER = `${ADMIN_ENDPOINT}/banner/delete`;
export const GET_SINGLE_BANNER = `${ADMIN_ENDPOINT}/banner/`;
export const EDIT_BANNER = `${ADMIN_ENDPOINT}/banner/update`;

// ADMIN

export const ADD_ADMIN = `${ADMIN_ENDPOINT}/admins/add-admin`;
export const GET_ALL_ADMIN = `${ADMIN_ENDPOINT}/admins/`;
export const DELETE_ADMIN = `${ADMIN_ENDPOINT}/admins/delete`;
export const EDIT_ADMIN = `${ADMIN_ENDPOINT}/admins/update`;
export const SINGLE_ADMIN = `${ADMIN_ENDPOINT}/admins/get-single-admin-details`;

// CHANGE PASSWORD
export const CHANGE_PASSWORD = `${ADMIN_ENDPOINT}/admins/change-password`;

// VAT
export const GET_ALL_ADMIN_VAT = `${ADMIN_ENDPOINT}/drop-wallet/admin-vat-details`;
export const GET_SINGLE_SHOP_VAT = `${ADMIN_ENDPOINT}/drop-wallet/shop-vat-details`;
export const SETTLE_ADMIN_VAT = `${ADMIN_ENDPOINT}/drop-wallet/settle-admin-vat`;
export const SETTLE_SHOP_VAT = `${ADMIN_ENDPOINT}/drop-wallet/settle-shop-vat`;

// ROLE
export const ADD_ADMIN_ROLE = `${ADMIN_ENDPOINT}/role/add`;
export const GET_ALL_ADMIN_ROLE = `${ADMIN_ENDPOINT}/role`;
export const EDIT_ADMIN_ROLE = `${ADMIN_ENDPOINT}/role/edit`;
export const DELETE_ADMIN_ROLE = `${ADMIN_ENDPOINT}/role/delete`;
export const RESTORE_ADMIN_ROLE = `${ADMIN_ENDPOINT}/role/restore`;

// USERS
export const ALL_USERS = `${ADMIN_ENDPOINT}/user`;
export const SINGLE_USER = `${ADMIN_ENDPOINT}/user/get-user-details`;
export const USER_TRANSACTIONS = `${ADMIN_ENDPOINT}/user/get-user-transaction`;
export const USER_ORDERS = `${ADMIN_ENDPOINT}/order/user`;
export const USER_STATUS = `${ADMIN_ENDPOINT}/USER/update-status`;

// CATEGORY
export const ADD_CATEGORY = `${ADMIN_ENDPOINT}/category/add-category`;
export const GET_ALL_CATEGORY = `${ADMIN_ENDPOINT}/category`;
export const SINGLE_CATEGORY = `${ADMIN_ENDPOINT}/category/get-single-category`;
export const EDIT_CATEGORY = `${ADMIN_ENDPOINT}/category/update`;

// SUB CATEGORY
export const ADD_SUB_CATEGORY = `${ADMIN_ENDPOINT}/sub-category/add`;
export const EDIT_SUB_CATEGORY = `${ADMIN_ENDPOINT}/sub-category/update`;
export const GET_ALL_SUB_CATEGORY = `${ADMIN_ENDPOINT}/sub-category/get-all-subcategory-by-category-id`;
export const DELETE_SUB_CAT = `${ADMIN_ENDPOINT}/sub-category/delete`;

// SELLER
export const ADD_SELLER = `${ADMIN_ENDPOINT}/seller/add`;
export const ALL_SELLER = `${ADMIN_ENDPOINT}/seller`;
export const EDIT_SELLER = `${ADMIN_ENDPOINT}/seller/update`;
export const DELETE_SELLER = `${ADMIN_ENDPOINT}/seller/delete`;
export const SINGLE_SELLER = `${ADMIN_ENDPOINT}/seller/get-seller-details`;
export const SELLER_DROP_CHARGE = `${ADMIN_ENDPOINT}/seller/add-drop-charge`;
export const ADD_SELLER_CREDENTIAL = `${ADMIN_ENDPOINT}/seller/add-credential`;
export const GET_SELLER_CREDENTIALS = `${ADMIN_ENDPOINT}/seller/credential`;
export const REMOVE_SELLER_CREDENTIAL = `${ADMIN_ENDPOINT}/seller/delete-credential`;

// SHOP
export const ADD_SHOP_DEAL = `${ADMIN_ENDPOINT}/shop/add-deal`;
export const ADD_SHOP = `${ADMIN_ENDPOINT}/shop/add`;
export const EDIT_SHOP = `${ADMIN_ENDPOINT}/shop/update`;
export const ALL_SHOP = `${ADMIN_ENDPOINT}/shop`;
export const DELETE_SHOP = `${ADMIN_ENDPOINT}/shop/delete`;
export const SINGLE_SHOP = `${ADMIN_ENDPOINT}/shop/get-shop-details`;
export const SHOP_LIVE_STATUS = `${ADMIN_ENDPOINT}/shop/shop-visibility-change`;
export const ADD_CUISINE = `${ADMIN_ENDPOINT}/cuisines/add`;
export const ALL_CUISINE = `${ADMIN_ENDPOINT}/cuisines`;
export const EDIT_CUISINE = `${ADMIN_ENDPOINT}/cuisines/update`;
export const SET_AS_FEATURED = `${ADMIN_ENDPOINT}/shop/add-feather-shop`;
export const DELETE_SHOP_DEAL = `${ADMIN_ENDPOINT}/shop/delete-deal`;
export const UPDATE_SHOP_STATUS = `${ADMIN_ENDPOINT}/shop/status`;
export const ADD_SHOP_CREDENTIAL = `${ADMIN_ENDPOINT}/shop/add-credential`;
export const GET_SHOP_CREDENTIALS = `${ADMIN_ENDPOINT}/shop/credential`;
export const REMOVE_SHOP_CREDENTIAL = `${ADMIN_ENDPOINT}/shop/delete-credential`;
export const ADD_SHOP_MAX_DISCOUNT = `${ADMIN_ENDPOINT}/shop/add-maxDiscount`;

// PRODUCT
export const ADD_PRODUCT = `${ADMIN_ENDPOINT}/product/add`;
export const ALL_PRODUCT = `${ADMIN_ENDPOINT}/product`;
export const EDIT_PRODUCT = `${ADMIN_ENDPOINT}/product/update`;
export const SINGLE_PRODUCT = `${ADMIN_ENDPOINT}/product/product-details`;
export const DELETE_PRODUCT = `${ADMIN_ENDPOINT}/product/delete`;
export const ADD_PRODUCT_DEAL = `${ADMIN_ENDPOINT}/product/add-deal`;
export const UPDATE_PRODUCT_STATUS = `${ADMIN_ENDPOINT}/product/status`;

export const DELETE_PRODUCT_DEAL = `${ADMIN_ENDPOINT}/product/delete-deal`;
export const UPDATE_PRODUCT_REWARD_SETTINGS = `${ADMIN_ENDPOINT}/product/add-reward`;
export const UPDATE_PRODUCT_REWARD_BUNDLE = `${ADMIN_ENDPOINT}/product/add-reward-bundle`;

export const ADD_UNIT = `${ADMIN_ENDPOINT}/unit/add`;
export const GET_ALL_UNIT = `${ADMIN_ENDPOINT}/unit`;
export const EDIT_UNIT = `${ADMIN_ENDPOINT}/unit/update`;
export const DELETE_UNIT = `${ADMIN_ENDPOINT}/unit/delete`;
export const DOWNLOAD_PRODUCT_TEMPLATE = `${ADMIN_ENDPOINT}/product/download-template`;
export const UPLOAD_PRODUCT_FILE = `${ADMIN_ENDPOINT}/product/import`;

// DELIVERY MAN
export const ADD_DELIVERY_MAN = `${ADMIN_ENDPOINT}/delivery-boy/add`;
export const ALL_DELIVERY_MAN = `${ADMIN_ENDPOINT}/delivery-boy`;
export const SINGLE_DELIVERY_MAN = `${ADMIN_ENDPOINT}/delivery-boy/get-single-delivery-boy`;
export const EDIT_DELIVERY_MAN = `${ADMIN_ENDPOINT}/delivery-boy/update`;
export const TRACK_DELIVERY_MAN = `${ADMIN_ENDPOINT}/delivery-boy/tracking`;
export const DELIVERY_BOY_ORDERS = `${ADMIN_ENDPOINT}/order/delivery`;
export const DELIVERY_BOY_CURRENT_LOCATION = `${ADMIN_ENDPOINT}/delivery-boy/get-current-location`;

//  SETTINGS
export const ADMINS_SETTINGS = '/admin/setting/admin-setting';
export const UPDATE_ADMINS_SETTINGS = '/admin/setting/admin-setting/edit';

export const UPDATE_APP_SETTINGS = '/admin/setting/app-setting/edit';
export const APP_SETTINGS = '/admin/setting/app-setting';
export const ADD_ORDER_CANCEL_REASON = `${ADMIN_ENDPOINT}/order-cancel/add`;
export const UPDATE_ORDER_CANCEL_REASON = `${ADMIN_ENDPOINT}/order-cancel/edit`;
export const ALL_ORDER_CANCEL_REASON = `${ADMIN_ENDPOINT}/order-cancel`;

export const SET_DELIVERY_FEE = `${ADMIN_ENDPOINT}/drop-charge/add-global-drop-charge`;
export const GET_DELIVERY_FEE = `${ADMIN_ENDPOINT}/drop-charge`;

export const UPDATE_DELIVERY_CUT = `${ADMIN_ENDPOINT}/drop-charge/add-global-delivery-cut`;
export const UPDATE_BULTER_DELIVERY_CUT = `${ADMIN_ENDPOINT}/drop-charge/add-global-delivery-cut-for-butler`;
export const GET_SPECIAL_DROP_CHARGE = `${ADMIN_ENDPOINT}/drop-charge/get-related-seller`;
export const DELETE_SELLER_SPECIAL_DROP_CHARGE = `${ADMIN_ENDPOINT}/drop-charge/seller-drop-charge-reset`;
export const ADMIN_LOGS_HISTORY = `${ADMIN_ENDPOINT}/setting/admin-logs`;
export const GET_ADMIN_REWARD_SETTINGS = `${ADMIN_ENDPOINT}/setting/reward-setting`;
export const EDIT_ADMIN_REWARD_SETTINGS = `${ADMIN_ENDPOINT}/setting/reward-setting/edit`;

export const DATABASE_ALL_COLLECTIONS = `${ADMIN_ENDPOINT}/database/collections`;
export const DATABASE_COLLECTION_BACKUP = `${ADMIN_ENDPOINT}/database/back-up`;
export const DATABASE_RESTORE_LAST_COLLECTION_BACKUP = `${ADMIN_ENDPOINT}/database/restore-backup`;
export const DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP = `${ADMIN_ENDPOINT}/database/restore-all-backup`;
export const DATABASE_DELETE_COLLECTION = `${ADMIN_ENDPOINT}/database/delete-collection`;
export const DATABASE_DELETE_ALL_COLLECTION = `${ADMIN_ENDPOINT}/database/delete-all`;

// DEAL

export const ADD_DEAL = `${ADMIN_ENDPOINT}/deal/add`;
export const GET_ALL_DEAL = `${ADMIN_ENDPOINT}/deal`;
export const EDIT_DEAL = `${ADMIN_ENDPOINT}/deal/edit`;
export const DELETE_DEAL = `${ADMIN_ENDPOINT}/deal/delete`;
export const SINGLE_DEAL = `${ADMIN_ENDPOINT}/deal/`;
export const ALL_DEAL_FOR_ADD = `${ADMIN_ENDPOINT}/deal/get-deals-for-add`;
export const ALL_TAG = `${ADMIN_ENDPOINT}/deal/get-tags`;

// DROP PAY

export const DROP_PAY_LIST = `${ADMIN_ENDPOINT}/drop-pay`;
export const ADD_USER_BALANCE = `${ADMIN_ENDPOINT}/user/add-balance`;
export const REMOVE_USER_BALANCE = `${ADMIN_ENDPOINT}/user/withdraw-balance`;

// APP WALLET

export const SELLERS_TRX = `${ADMIN_ENDPOINT}/drop-wallet/sellers`;
export const SELLER_TRX = `${ADMIN_ENDPOINT}/drop-wallet/seller/shops`;
export const SHOP_TRX = `${ADMIN_ENDPOINT}/drop-wallet/seller/shops-details`;
export const DELIVERY_TRX = `${ADMIN_ENDPOINT}/drop-wallet/delivery-boy-transection`;
export const SINGLE_DELIVERY_TRX = `${ADMIN_ENDPOINT}/drop-wallet/single-delivery-boy-info`;
export const DROP_TRX = `${ADMIN_ENDPOINT}/wallet/admin`;
export const ALL_TRX = `${ADMIN_ENDPOINT}/drop-wallet/transection`;
export const SHOP_MAKE_PAYMENT = `${ADMIN_ENDPOINT}/drop-wallet/settle-amount-seller`;

export const SHOP_ADD_REMOVE_CREDIT = `${ADMIN_ENDPOINT}/drop-wallet/shop-amount-add-remove`;

export const SHOP_ADJUST_CASH = `${ADMIN_ENDPOINT}/drop-wallet/shop-cash-in-hand-adjust`;

export const RIDER_MAKE_PAYMENT = `${ADMIN_ENDPOINT}/drop-wallet/settle-amount-delivery-boy`;

export const RIDER_RECEIVED_PAYMENT = `${ADMIN_ENDPOINT}/drop-wallet/cash-received-from-delivery-boy`;

// ORDERS
export const ORDER_LIST = `${ADMIN_ENDPOINT}/order`;
export const SINGLE_ORDER = `${ADMIN_ENDPOINT}/order/single-details`;
export const ORDRE_UPDATE_STATUS = `${ADMIN_ENDPOINT}/order/update-order-status`;

export const SEND_ORDER_FLAG = `${ADMIN_ENDPOINT}/order/flag`;
export const DELETE_ORDER_FLAG = `${ADMIN_ENDPOINT}/order/flag/delete`;
export const CANCEL_ORDER = `${ADMIN_ENDPOINT}/order/cancel-order`;
export const ACTIVE_DEIVERY_BOYS = `${ADMIN_ENDPOINT}/order/get-nearby-delivery-boy-order`;

// BUTLER
export const BUTLER_ORDER_LIST = `${ADMIN_ENDPOINT}/butler`;
export const BUTLER_SINGLE_ORDER = `${ADMIN_ENDPOINT}/butler/single-details`;
export const BUTLER_ORDER_UPDATE_STATUS = `${ADMIN_ENDPOINT}/butler/update-order-status`;
export const BUTLER_ORDER_ADD_FLAG = `${ADMIN_ENDPOINT}/butler/flag`;
export const BUTLER_ORDER_EDIT_FLAG = `${ADMIN_ENDPOINT}/butler/flag/edit`;
export const BUTLER_ORDER_DELETE_FLAG = `${ADMIN_ENDPOINT}/butler/flag/delete`;
export const NEAR_BY_BUTLERS_FOR_ORDER = `${ADMIN_ENDPOINT}/butler/get-nearby-delivery-boy-order`;
export const BUTLER_CANCEL_ORDER = `${ADMIN_ENDPOINT}/butler/cancel-order`;

// CHAT
export const CHAT_LIST = `${ADMIN_ENDPOINT}/user-chat-request`;
export const ACCEPT_CHAT = `${ADMIN_ENDPOINT}/user-chat-request/accept`;
export const SEND_MESSAGE = `${ADMIN_ENDPOINT}/user-chat-request/send-message`;
export const SINGLE_CHAT = `${ADMIN_ENDPOINT}/user-chat-request/chats-by-order`;
export const LAST_FIVE_ORDER = `${ADMIN_ENDPOINT}/order/get-five-order?userId=`;
export const CHAT_REQUESTS_FOR_SINGLE_ORDER = `${ADMIN_ENDPOINT}/user-chat-request/chats-in-order`;
export const REJECT_CHAT = `${ADMIN_ENDPOINT}/user-chat-request/reject`;
export const GET_DEFAULT_CHAT = `${ADMIN_ENDPOINT}/message`;
export const ADD_DEFAULT_CHAT = `${ADMIN_ENDPOINT}/message`;
export const EDIT_DEFAULT_CHAT = `${ADMIN_ENDPOINT}/message/update`;
export const CLOSE_CONVERSATION = `${ADMIN_ENDPOINT}/user-chat-request/close`;

// TERMS AND CONDITIONS

export const ADD_TERMS_AND_CONDITIONS = `${ADMIN_ENDPOINT}/`;

// NOTIFICATION

export const CREATE_NOTIFICATION = `${ADMIN_ENDPOINT}/notification/add`;
export const GET_NOTIFICATIONS = `${ADMIN_ENDPOINT}/notification`;
export const UPDATE_NOTIFICATION_STATUS = `${ADMIN_ENDPOINT}/notification/delete`;

// TERMS AND CONDITIONS

export const UPDATE_CONDITION = `${ADMIN_ENDPOINT}/setting/app-setting/terms/edit`;
export const GET_CONDITION = `${ADMIN_ENDPOINT}/setting/app-setting/terms`;

// TAG

export const CREATE_TAG = `${ADMIN_ENDPOINT}/tags/add`;
export const ALL_TAGS = `${ADMIN_ENDPOINT}/tags`;
export const UPDATE_TAG = `${ADMIN_ENDPOINT}/tags/update`;

// IMAGE UPLOAD

export const IMAGE_UPLOAD = 'image/single-image-upload';

// END ADMIN API

// FAQ
export const GET_FAQ = `${ADMIN_ENDPOINT}/faq`;
export const ADD_FAQ = `${ADMIN_ENDPOINT}/faq/add`;
export const UPDATE_FAQ = `${ADMIN_ENDPOINT}/faq/update`;
export const DELETE_FAQ = `${ADMIN_ENDPOINT}/faq/delete`;

// CHAT REASON
export const GET_CHAT_REASON = `${ADMIN_ENDPOINT}/chat-reason`;
export const ADD_CHAT_REASON = `${ADMIN_ENDPOINT}/chat-reason/add`;
export const UPDATE_CHAT_REASON = `${ADMIN_ENDPOINT}/chat-reason/edit`;
export const DELETE_CHAT_REASON = `${ADMIN_ENDPOINT}/chat-reason/delete`;

// RATING
export const GET_ALL_RATINGS = `${ADMIN_ENDPOINT}/setting/rating`;
export const ADD_NEW_RATING = `${ADMIN_ENDPOINT}/setting/rating/add`;
export const UPDATE_RATING = `${ADMIN_ENDPOINT}/setting/rating/edit`;
export const DELETE_NEW_RATING = `${ADMIN_ENDPOINT}/setting/rating/delete`;

// FLAGS
export const GET_ALL_FLAGS = `${ADMIN_ENDPOINT}/flag`;
export const RESOLVE_FLAG = `${ADMIN_ENDPOINT}/flag/resolved-flag`;
