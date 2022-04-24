import { toast } from "react-toastify";
import { ADD_PRODUCT, ALL_PRODUCT,DELETE_PRODUCT,EDIT_PRODUCT } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";


// ADD

export const addProduct = (values) => async (dispatch) => {
    console.log({ values });
    try {
      dispatch({
        type: actionType.ADD_PRODUCT_REQUEST_SEND,
      });
  
      const { data } = await requestApi().request(ADD_PRODUCT, {
        method: "POST",
        data: values,
      });
  
      console.log({ data });
  
      if (data.status) {
        toast.success(data.message, {
          // position: "bottom-right",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch({
          type: actionType.ADD_PRODUCT_REQUEST_SUCCESS,
          payload: data.data.category,
        });
      } else {
        toast.warn(data.message, {
          // position: "bottom-right",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch({
          type: actionType.ADD_PRODUCT_REQUEST_FAIL,
          payload: data.message,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.ADD_PRODUCT_REQUEST_FAIL,
        payload: error.message,
      });
    }
  };

  // GET ALL

export const getAllProduct =
(refresh = false, page = 1) =>
async (dispatch, getState) => {
  // console.log({adminData})
  const { products, searchKey, statusKey, typeKey, sortByKey,productVisibilityKey } =
    getState().productReducer;

  if (products.length < 1 || refresh) {
    try {
      dispatch({
        type: actionType.GET_ALL_PRODUCT_REQUEST_SEND,
      });

      const { data } = await requestApi().request(ALL_PRODUCT, {
        params: {
          page: page,
          pageSize: 50,
          sortBy: sortByKey.value,
          searchKey,
          type: typeKey.value,
          status: statusKey.value,
          productVisibility: productVisibilityKey.value
        },
      });

      console.log({ data });

      if (data.status) {
        dispatch({
          type: actionType.GET_ALL_PRODUCT_REQUEST_SUCCESS,
          payload: data.data,
        });
      } else {
        dispatch({
          type: actionType.GET_ALL_PRODUCT_REQUEST_FAIL,
          payload: data.message,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.GET_ALL_PRODUCT_REQUEST_FAIL,
        payload: error.message,
      });
    }
  }
};

// EDIT

export const editProduct = (values) => async (dispatch) => {
  // console.log({ values });
  try {
    dispatch({
      type: actionType.EDIT_PRODUCT_REQUEST_SEND,
    });
    const { data } = await requestApi().request(EDIT_PRODUCT, {
      method: "POST",
      data: values,
    });

    console.log({ data });

    if (data.status) {
      toast.success(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_PRODUCT_REQUEST_SUCCESS,
          payload: data.data.product,
        });
      }, 400);
    } else {
      toast.warn(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch({
        type: actionType.EDIT_PRODUCT_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_PRODUCT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

//   DELETE 

export const deleteProduct = (id) => async (dispatch) => {
 
  try {
    dispatch({
      type: actionType.DELETE_PRODUCT_REQUEST_SEND,
    });
    const { data } = await requestApi().request(DELETE_PRODUCT, {
      method: "POST",
      data: {id},
    });

    console.log({ data });

    if (data.status) {
      toast.success(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      dispatch({
        type: actionType.DELETE_PRODUCT_REQUEST_SUCCESS,
        payload: data.data.product,
      });
    } else {
      toast.warn(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch({
        type: actionType.DELETE_PRODUCT_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_SHOP_REQUEST_FAIL,
      payload: error.message,
    });
  }
};




 // UPDATE SEARCH KEY

export const updateProductSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SEARCH_KEY,
    payload: value,
  });
};

// UPDATE STATUS KEY

export const updateProductStatusKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_STATUS_KEY,
    payload: value,
  });
};

// UPDATE SORT BY KEY

export const updateProductSortByKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SORT_BY_KEY,
    payload: value,
  });
}; 

// PRODUCT VISIBILITY KEY 

export const updateProductVisibilityByKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_PRODUCT_VISIBILITY_KEY,
    payload: value,
  });
}; 

// TYPE KEY

export const updateProductType = (selectedType) => (dispatch) => {
  // console.log("selected car type", selectedType);
  dispatch({
    type: actionType.UPDATE_TYPE_KEY,
    payload: selectedType,
  });
};