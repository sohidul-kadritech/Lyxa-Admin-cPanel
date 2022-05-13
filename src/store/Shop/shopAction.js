import * as actionType from "../actionType";
import { toast } from "react-toastify";
import requestApi from "../../network/httpRequest";
import { ADD_CUISINE, ADD_SHOP, ALL_SHOP, DELETE_SHOP, EDIT_SHOP, SHOP_LIVE_STATUS } from "../../network/Api";

// ADD
export const addShop = (values) => async (dispatch) => {
  console.log({ values });
  try {
    dispatch({
      type: actionType.ADD_SHOP_REQUEST_SEND,
    });
    const { data } = await requestApi().request(ADD_SHOP, {
      method: "POST",
      data: values,
    });

    console.log({ data });

    if (data.status) {
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
        type: actionType.ADD_SHOP_REQUEST_SUCCESS,
        payload: data.data.shop,
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
        type: actionType.ADD_SHOP_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_SHOP_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL

export const getAllShop =
  (refresh = false,seller = null, page = 1) =>
  async (dispatch, getState) => {
    // console.log({adminData})
    const { shops, searchKey, statusKey, typeKey, sortByKey,liveStatus } =
      getState().shopReducer;

    if (shops.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.GET_ALL_SHOP_REQUEST_SEND,
        });

        const { data } = await requestApi().request(ALL_SHOP, {
          params: {
            page: page,
            pageSize: 10,
            sortBy: sortByKey.value,
            searchKey,
            type: typeKey.value,
            shopStatus: statusKey.value,
            liveStatus: liveStatus.value,
            sellerId: seller
          },
        });

        // console.log({ data });

        if (data.status) {
          dispatch({
            type: actionType.GET_ALL_SHOP_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionType.GET_ALL_SHOP_REQUEST_FAIL,
            payload: data.message,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.GET_ALL_SHOP_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// EDIT

export const editShop = (values) => async (dispatch) => {
  // console.log({ values });
  try {
    dispatch({
      type: actionType.EDIT_SHOP_REQUEST_SEND,
    });
    const { data } = await requestApi().request(EDIT_SHOP, {
      method: "POST",
      data: values,
    });

    console.log({ data });

    if (data.status) {
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

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_SHOP_REQUEST_SUCCESS,
          payload: data.data.shop,
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
        type: actionType.EDIT_SHOP_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_SHOP_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

//   DELETE 

export const deleteShop = (id) => async (dispatch) => {
 
    try {
      dispatch({
        type: actionType.DELETE_SHOP_REQUEST_SEND,
      });
      const { data } = await requestApi().request(DELETE_SHOP, {
        method: "POST",
        data: {id},
      });
  
      // console.log({ data });
  
      if (data.status) {
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
          type: actionType.DELETE_SHOP_REQUEST_SUCCESS,
          payload: id,
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
          type: actionType.DELETE_SHOP_REQUEST_FAIL,
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


// CHANGE LIVE STATUS
export const ShopLiveStatus = (value) => async (dispatch) => {
 
  try {
    dispatch({
      type: actionType.SHOP_LIVE_STATUS_REQUEST_SEND,
    });
    const { data } = await requestApi().request(SHOP_LIVE_STATUS, {
      method: "POST",
      data: value
    });

    console.log({ data });

    if (data.status) {
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
        type: actionType.SHOP_LIVE_STATUS_REQUEST_SUCCESS,
        payload: data.data.shop,
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
        type: actionType.SHOP_LIVE_STATUS_REQUEST_FAIL,
        payload: data.data.shop,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.SHOP_LIVE_STATUS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// SET STATUS FALSE

export const setShopStatusFalse = () => (dispatch) => {
  dispatch({
    type: actionType.SET_STATUS_FALSE,
  });
};

// UPDATE SEARCH KEY

export const updateShopSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SEARCH_KEY,
    payload: value,
  });
};

// UPDATE STATUS KEY

export const updateShopStatusKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_STATUS_KEY,
    payload: value,
  });
};

// UPDATE SORT BY KEY

export const updateSortByKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SORT_BY_KEY,
    payload: value,
  });
};

// type key

export const updateShopType = (selectedType) => (dispatch) => {
  // console.log("selected car type", selectedType);
  dispatch({
    type: actionType.UPDATE_TYPE_KEY,
    payload: selectedType,
  });
};

export const updateShopLiveStatus = (value) => (dispatch) => {
  // console.log("selected car type", selectedType);
  dispatch({
    type: actionType.UPDATE_SHOP_LIVE_STATUS,
    payload: value,
  });
};

// ADD CUISINES

export const addCuisine = (name) => async (dispatch) => {
  console.log({name})
  try {
    dispatch({
      type: actionType.ADD_CUISINE_REQUEST_SEND,
    });

    const {
      data: { status, message, error, data = null },
    } = await requestApi().request(ADD_CUISINE, {
      method: "POST",
      data: { name },
    });

    console.log({data})

    if (status) {
      toast.warn(message, {
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
        type: actionType.ADD_CUISINE_REQUEST_SUCCESS,
        payload: data.cuisines,
      });
    } else {
      toast.warn(error, {
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
        type: actionType.ADD_CUISINE_REQUEST_FAIL,
        paylaod: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_CUISINE_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};
