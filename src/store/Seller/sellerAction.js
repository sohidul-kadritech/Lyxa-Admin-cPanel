import * as actionType from "../actionType";
import requestApi from "../../network/httpRequest";
import {
  ADD_SELLER,
  ALL_SELLER,
  DELETE_SELLER,
  EDIT_SELLER,
} from "../../network/Api";
import { toast } from "react-toastify";

// ADD
export const addSeller = (values) => async (dispatch) => {
  console.log({ values });
  try {
    dispatch({
      type: actionType.ADD_SELLER_REQUEST_SEND,
    });
    const { data } = await requestApi().request(ADD_SELLER, {
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
        type: actionType.ADD_SELLER_REQUEST_SUCCESS,
        payload: data.data.seller,
      });
    } else {
      toast.warn(data.error, {
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
        type: actionType.ADD_SELLER_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    toast.warn(error.message, {
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
      
      type: actionType.ADD_SELLER_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL

export const getAllSeller =
  (refresh = false, page = 1) =>
  async (dispatch, getState) => {
    // console.log({adminData})
    const { sellers, sortByKey, searchKey, statusKey, typeKey, subTypeKey } =
      getState().sellerReducer;

    if (sellers.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.GET_ALL_SELLER_REQUEST_SEND,
        });

        const { data } = await requestApi().request(ALL_SELLER, {
          params: {
            page: page,
            pageSize: 50,
            sortBy: sortByKey.value,
            sellerStatus: statusKey.value,
            sellerType: typeKey.value,
            subType: subTypeKey.value,
            searchKey
          },
        });

        console.log({ data });

        if (data.status) {
          dispatch({
            type: actionType.GET_ALL_SELLER_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionType.GET_ALL_SELLER_REQUEST_FAIL,
            payload: data.message,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.GET_ALL_SELLER_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// EDIT

export const editSeller = (values) => async (dispatch) => {
  console.log({ values });
  try {
    dispatch({
      type: actionType.EDIT_SELLER_REQUEST_SEND,
    });
    const { data } = await requestApi().request(EDIT_SELLER, {
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
          type: actionType.EDIT_SELLER_REQUEST_SUCCESS,
          payload: data.data.seller,
        });
      }, 450);
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
        type: actionType.EDIT_SELLER_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_SELLER_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

//   DELETE

export const deleteSeller = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.DELETE_SELLER_REQUEST_SEND,
    });
    const { data } = await requestApi().request(DELETE_SELLER, {
      method: "POST",
      data: { id },
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
        type: actionType.DELETE_SELLER_REQUEST_SUCCESS,
        payload: data.data.seller,
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
        type: actionType.DELETE_SELLER_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_SELLER_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// SET STATUS FALSE

export const setSellerStatusFalse = () => (dispatch) => {
  dispatch({
    type: actionType.SET_STATUS_FALSE,
  });
};

// UPDATE SORT BY KEY

export const updateSellerSortByKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SORT_BY_KEY,
    payload: value,
  });
};

// UPDATE SELLER TYPE

export const updateSellerType = (selectedType) => (dispatch) => {
  // console.log("selected car type", selectedType);
  dispatch({
    type: actionType.UPDATE_TYPE_KEY,
    payload: selectedType,
  });
};

// SELLER STATUS

export const updateSellerStatusKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_STATUS_KEY,
    payload: value,
  });
};

// SELLER SUB TYPE

export const updateSellerSubTypeKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SELLER_SUB_TYPE,
    payload: value,
  });
};

// UPDATE SEARCH KEY

export const updateSellerSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SEARCH_KEY,
    payload: value,
  });
};
