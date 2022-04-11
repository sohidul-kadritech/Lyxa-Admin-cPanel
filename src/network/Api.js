// export const API_URL = "http://localhost:5000";
// export const FTP_URL = "http://localhost:1000";

export const API_URL = "https://api.codepadding.com";
export const FTP_URL = "https://ftp.codepadding.com";

// FTP SERVER API
export const MULTIPLE_IMAGE_UPLOAD = FTP_URL + "/api/upload/image/multitples";

const ADMIN_ENDPOINT = "/api/v1/admin";

// ADMIN API

// LOGIN API

export const LOGIN = ADMIN_ENDPOINT + "/auth/login";

// IMAGE UPLOAD
export const IMAGE_UPLOAD = ADMIN_ENDPOINT + "/image/upload";
export const LIST_IMAGE_FOLDER = ADMIN_ENDPOINT + "/image-folder/";
export const CREATE_IMAGE_FOLDER = ADMIN_ENDPOINT + "/image-folder/create";

// GET IMAGE
export const GET_GALLERY_LIST = ADMIN_ENDPOINT + "/image";

// banner
export const BANNER_LIST = ADMIN_ENDPOINT + "/banner";
export const ADD_BANNER = ADMIN_ENDPOINT + "/banner/add";
export const DELETE_BANNER = ADMIN_ENDPOINT + "/banner/delete";
export const GET_SINGLE_BANNER = ADMIN_ENDPOINT + "/banner/";
export const EDIT_BANNER = ADMIN_ENDPOINT + "/banner/edit";

// CAR TYPE

export const ADD_CAR_TYPE = ADMIN_ENDPOINT + "/carType/addNew";
export const GET_CAR_TYPES = ADMIN_ENDPOINT + "/carType";
export const DELETE_CAR_TYPE_PERMANENTLY =
  ADMIN_ENDPOINT + "/carType/deleteCarTypepParmanently";

export const EDIT_CAR_TYPE = ADMIN_ENDPOINT + "/carType/editCarType";
export const GET_SINGLE_CAR_TYPE = ADMIN_ENDPOINT + "/carType/";
export const GET_CAR_TYPE_FULL_DETAILS = ADMIN_ENDPOINT + "/carType/";

export const SINGLE_CAR_BRAND = ADMIN_ENDPOINT + "/car-brand/";

// COLOR

export const ADD_COLOR = ADMIN_ENDPOINT + "/color/addNew";
export const GET_ALL_COLOR = ADMIN_ENDPOINT + "/color/getColors";
export const EDIT_COLOR = ADMIN_ENDPOINT + "/color/editColor";

// YEAR

export const ADD_YEAR = ADMIN_ENDPOINT + "/year/add";
export const GET_ALL_YEARS = ADMIN_ENDPOINT + "/year/getAll";
export const EDIT_YEAR = ADMIN_ENDPOINT + "/year/update";

// ADMIN ROLE

export const ADD_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/add";
export const GET_ALL_ADMIN_ROLE = ADMIN_ENDPOINT + "/role";
export const EDIT_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/edit";
export const DELETE_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/delete";
export const RESTORE_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/restore";

// PARTNER

export const ADD_PARTNER = ADMIN_ENDPOINT + "/partner/add";
export const ALL_PARTNER = ADMIN_ENDPOINT + "/partner";
export const SINGLE_PARTNER = ADMIN_ENDPOINT + "/partner/";
export const EDIT_PARTNER = ADMIN_ENDPOINT + "/partner/edit";

//  DRIVER

export const ADD_DRIVER = ADMIN_ENDPOINT + "/driver/add";
export const GET_ALL_DRIVERS_BY_PARTNER = ADMIN_ENDPOINT + "/driver/partner/";
export const GET_SINGLE_DRIVER = ADMIN_ENDPOINT + "/driver/";
export const EDIT_DRIVER = ADMIN_ENDPOINT + "/driver/edit";
export const ALL_DRIVERS = ADMIN_ENDPOINT + "/driver";
export const SINGLE_DRIVER = ADMIN_ENDPOINT + "/driver/";

// CAR BRAND

export const ADD_CAR_BRAND = ADMIN_ENDPOINT + "/car-brand/add-new";
export const EDIT_CAR_BRAND = ADMIN_ENDPOINT + "/car-brand/edit";

// CAR BRAND MODEL

export const ADD_MODEL = ADMIN_ENDPOINT + "/car-model/add-new";
export const EDIT_MODEL = ADMIN_ENDPOINT + "/car-model/edit";
export const COLORS_YEARS = ADMIN_ENDPOINT + "/car-model/get-year-and-color";

// MODEL COLOR
export const ADD_MODEL_COLOR = ADMIN_ENDPOINT + "/car-color/add-new";

// MODEL YEAR

export const ADD_MODEL_YEAR = ADMIN_ENDPOINT + "/car-year/add-new";

//  CAR FUEL

export const GET_CAR_FUEL_TYPES = ADMIN_ENDPOINT + "/car-fuel-types";

//  CAR FOR PARTNER

export const ADD_CAR = ADMIN_ENDPOINT + "/cars/add-new";
// export const EDIT_CAR = ADMIN_ENDPOINT + "/cars/edit-new";
export const SINGLE_CAR = ADMIN_ENDPOINT + "/cars/single-car-by-id";
export const EDIT_CAR = ADMIN_ENDPOINT + "/cars/edit";

// RIDE

export const ALL_RIDES = ADMIN_ENDPOINT + "/ride";
export const ADD_RIDE = ADMIN_ENDPOINT + "/ride/add";

// USERS

export const ALL_USERS = ADMIN_ENDPOINT + "/user";
export const ADD_USER = ADMIN_ENDPOINT + "/user/add";
export const EDIT_USER = ADMIN_ENDPOINT + "/user/update";
export const SINGLE_USER = ADMIN_ENDPOINT + "/user/single-user-info-by-id";

// POLICY

export const ADD_POLICY = ADMIN_ENDPOINT + "/policy/add-policy";
export const GET_SINGLE_POLICY = ADMIN_ENDPOINT + "/policy";

// USER PAYMENT CONDITION

export const ADD_USER_PAYMENT_CONDITION =
  ADMIN_ENDPOINT + "/setting/add-user-payment-condition";

export const GET_ALL_PAYMENT_CONDITIONS =
  ADMIN_ENDPOINT + "/setting/get-all-user-payment-condition";
  

export const EDIT_USER_PAYMENT_CONDITION = ADMIN_ENDPOINT + "/setting/edit-user-payment-condition"

// GET ALL CARS

export const GET_ALL_CARS = ADMIN_ENDPOINT + "/cars";


// TUTORIAL 

export const ALL_TUTORIAL = ADMIN_ENDPOINT + "/tutorial"

export const ADD_TUTORIAL = ADMIN_ENDPOINT + "/tutorial/add";
export const DELETE_TUTORIAL = ADMIN_ENDPOINT + "/tutorial/delete";

// END ADMIN API
