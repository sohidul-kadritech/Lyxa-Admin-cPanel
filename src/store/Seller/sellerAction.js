import * as actionType from "../actionType";
import requestApi from "../../network/httpRequest";
import {
  ADD_SELLER,
  ADD_SELLER_CREDENTIAL,
  ALL_SELLER,
  DELETE_SELLER,
  EDIT_SELLER,
  SELLER_DROP_CHARGE,
} from "../../network/Api";
import { toast } from "react-toastify";
import { successMsg } from "../../helpers/successMsg";

// ADD
export const addSeller = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionType.ADD_SELLER_REQUEST_SEND,
    });
    const { data } = await requestApi().request(ADD_SELLER, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.ADD_SELLER_REQUEST_SUCCESS,
        payload: data.data.seller,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.ADD_SELLER_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    successMsg(error.message, "error");
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
              searchKey,
            },
          });

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

  try {
    dispatch({
      type: actionType.EDIT_SELLER_REQUEST_SEND,
    });
    const { data } = await requestApi().request(EDIT_SELLER, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_SELLER_REQUEST_SUCCESS,
          payload: data.data.seller,
        });
      }, 450);
    } else {
      successMsg(data.message, "error");

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

    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.DELETE_SELLER_REQUEST_SUCCESS,
        payload: data.data.seller,
      });
    } else {
      successMsg(data.message, "error");
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

// ADD SELLER DLIVERY CHARGE

export const addSellerCharge = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_SELLER_DROP_CHARGE_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SELLER_DROP_CHARGE, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      const { seller } = data?.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_SELLER_DROP_CHARGE_REQUEST_SUCCESS,
        payload: seller,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_SELLER_DROP_CHARGE_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_SELLER_DROP_CHARGE_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET SELLER CREDENTIALS

