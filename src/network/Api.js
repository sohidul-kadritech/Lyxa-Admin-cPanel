// export const API_URL = "http://localhost:5000";
// export const FTP_URL = "http://localhost:1000";

export const API_URL = "http://34.133.244.127/";
export const FTP_URL = "https://ftp.codepadding.com";

// FTP SERVER API
export const MULTIPLE_IMAGE_UPLOAD = FTP_URL + "/api/upload/image/multitples";

const ADMIN_ENDPOINT = "admin";

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
export const EDIT_BANNER = ADMIN_ENDPOINT + "/banner/update";



// ADMIN 

export const ADD_ADMIN = ADMIN_ENDPOINT + "/admins/add-admin";
export const GET_ALL_ADMIN = ADMIN_ENDPOINT + "/admins";
export const DELETE_ADMIN = ADMIN_ENDPOINT + "/admins/delete";
export const EDIT_ADMIN = ADMIN_ENDPOINT + "/admins/update";
export const SINGLE_ADMIN = ADMIN_ENDPOINT + "/admins/get-single-admin-details";

// ROLE

export const ADD_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/add";
export const GET_ALL_ADMIN_ROLE = ADMIN_ENDPOINT + "/role";
export const EDIT_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/edit";
export const DELETE_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/delete";
export const RESTORE_ADMIN_ROLE = ADMIN_ENDPOINT + "/role/restore";



// USERS

export const ALL_USERS =  "user";
export const ADD_USER = ADMIN_ENDPOINT + "/user/add";
export const EDIT_USER = ADMIN_ENDPOINT + "/user/update";
export const SINGLE_USER = ADMIN_ENDPOINT + "/user/single-user-info-by-id";


// CATEGORY 
export const ADD_CATEGORY = ADMIN_ENDPOINT + "/category/add-category";
export const GET_ALL_CATEGORY = ADMIN_ENDPOINT + "/category";
export const SINGLE_CATEGORY = ADMIN_ENDPOINT + "/category/get-single-category";
export const EDIT_CATEGORY = ADMIN_ENDPOINT + "/category/update";

// SUB CATEGORY 
export const ADD_SUB_CATEGORY = ADMIN_ENDPOINT + "/sub-category/add";
export const EDIT_SUB_CATEGORY = ADMIN_ENDPOINT + "/sub-category/update";
export const GET_ALL_SUB_CATEGORY = ADMIN_ENDPOINT + "/sub-category/get-all-subcategory-by-category-id"

// SELLER 
export const ADD_SELLER = ADMIN_ENDPOINT + "/seller/add";
export const ALL_SELLER = ADMIN_ENDPOINT + "/seller";
export const EDIT_SELLER = ADMIN_ENDPOINT + "/seller/update";
export const DELETE_SELLER = ADMIN_ENDPOINT + "/seller/delete";



// END ADMIN API
