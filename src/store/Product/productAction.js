import { successMsg } from "../../helpers/successMsg";
import {
  ADD_PRODUCT,
  ALL_PRODUCT,
  EDIT_PRODUCT,
  ADD_PRODUCT_DEAL,
  UPDATE_PRODUCT_STATUS,
  DELETE_PRODUCT_DEAL,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// ADD

export const addProduct = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_PRODUCT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_PRODUCT, {
      method: "POST",
      data: values,
    });


    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_PRODUCT_REQUEST_SUCCESS,
        payload: data.data.product,
      });
    } else {
      successMsg(data.message, "error");
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
  (refresh = false, shopId = null, sellerId = null, page = 1) =>
    async (dispatch, getState) => {

      const { products, searchKey, statusKey, typeKey, sortByKey } =
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
              shop: shopId,
              seller: sellerId,
            },
          });



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

  try {
    dispatch({
      type: actionType.EDIT_PRODUCT_REQUEST_SEND,
    });
    const { data } = await requestApi().request(EDIT_PRODUCT, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_PRODUCT_REQUEST_SUCCESS,
          payload: data.data.product,
        });
      }, 350);
    } else {
      successMsg(data.message, "error");
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

//  UPDATE STATUS

export const updateProductStatus = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionType.UPDATE_PRODUCT_STATUS_REQUEST_SEND,
    });
    const { data } = await requestApi().request(UPDATE_PRODUCT_STATUS, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.UPDATE_PRODUCT_STATUS_REQUEST_SUCCESS,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.UPDATE_PRODUCT_STATUS_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.UPDATE_PRODUCT_STATUS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// ADD PRODUCT DEAL

export const addProductDeal = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_PRODUCT_DEAL_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_PRODUCT_DEAL, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.ADD_PRODUCT_DEAL_REQUEST_SUCCESS,
        payload: data.data.product,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_PRODUCT_DEAL_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_PRODUCT_DEAL_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// UPDATE SEARCH KEY

export const updateProductSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_PRODUCT_SEARCH_KEY,
    payload: value,
  });
};

// UPDATE STATUS KEY

export const updateProductStatusKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_PRODUCT_STATUS_KEY,
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

// TYPE KEY

export const updateProductType = (selectedType) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_TYPE_KEY,
    payload: selectedType,
  });
};

// DELETE PRODUCT DEAL

export const deleteDealOfProduct = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionType.DELETE_PRODUCT_DEAL_REQUEST_SEND,
    });

    const {
      data: { status, error, data = null },
    } = await requestApi().request(DELETE_PRODUCT_DEAL, {
      method: "POST",
      data: values,
    });



    if (status) {
      successMsg("Successfully deleted", "success");
      dispatch({
        type: actionType.DELETE_PRODUCT_DEAL_REQUEST_SUCCESS,
        payload: data.product,
      });
    } else {
      successMsg(error, "error");
      dispatch({
        type: actionType.DELETE_PRODUCT_DEAL_REQUEST_FAIL,
        paylaod: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_PRODUCT_DEAL_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};
