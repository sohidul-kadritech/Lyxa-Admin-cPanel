import {
  ACTIVE_DEIVERY_BOYS,
  CANCEL_ORDER,
  DELETE_ORDER_FLAG,
  ORDER_LIST,
  ORDRE_UPDATE_STATUS,
  SEND_ORDER_FLAG,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";
import { successMsg } from "./../../helpers/successMsg";

// GET ALL ORDER

export const getAllOrder =
  (refresh = false, shop, seller, page = 1) =>
    async (dispatch, getState) => {
      const {
        orders,
        typeKey,
        startDate,
        endDate,
        sortByKey,
        orderSearchKey,
        orderType,
      } = getState().orderReducer;

      if (orders.length < 1 || refresh) {
        try {
          dispatch({
            type: actionType.ALL_ORDERS_REQUEST_SEND,
          });

          const {
            data: { status, error, data = null },
          } = await requestApi().request(ORDER_LIST, {
            params: {
              page,
              pageSize: 50,
              startDate,
              endDate,
              orderType: orderType.value,
              sortBy: sortByKey.value,
              type: typeKey.value,
              searchKey: orderSearchKey,
              shop,
              seller,
            },
          });


          if (status) {
            dispatch({
              type: actionType.ALL_ORDERS_REQUEST_SUCCESS,
              payload: data,
            });
          } else {
            dispatch({
              type: actionType.ALL_ORDERS_REQUEST_FAIL,
              payload: error,
            });
          }
        } catch (error) {
          dispatch({
            type: actionType.ALL_ORDERS_REQUEST_FAIL,
            payload: error.message,
          });
        }
      }
    };

// ORDER UPDATE STATUS

export const orderUpdateStatus = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ORDER_UPDATE_STATUS_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ORDRE_UPDATE_STATUS, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ORDER_UPDATE_STATUS_REQUEST_SUCCESS,
        payload: data,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionType.ORDER_UPDATE_STATUS_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ORDER_UPDATE_STATUS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// ORDER FLAG

export const sentOrderFlag = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionType.SEND_ORDER_FLAG_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SEND_ORDER_FLAG, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.SEND_ORDER_FLAG_REQUEST_SUCCESS,
        payload: data,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionType.SEND_ORDER_FLAG_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.SEND_ORDER_FLAG_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// DELETE ORDER FLAG

export const DeleteOrderFlag = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.DELETE_ORDER_FLAG_REQUEST_SEND,
    });

    const { data } = await requestApi().request(DELETE_ORDER_FLAG, {
      method: "POST",
      data: {
        id,
      },
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.DELETE_ORDER_FLAG_REQUEST_SUCCESS,
        payload: data,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionType.DELETE_ORDER_FLAG_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_ORDER_FLAG_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// CANCEL ORDER

export const cancelOrderByAdmin = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.CANCEL_ORDER_REQUEST_SEND,
    });

    const { data } = await requestApi().request(CANCEL_ORDER, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.CANCEL_ORDER_REQUEST_SUCCESS,
        payload: data,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionType.CANCEL_ORDER_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.CANCEL_ORDER_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// FITLERS

export const updateOrderSortByKey = (type) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ORDER_SORT_BY_FILTER,
    payload: type,
  });
};

export const updateOrderStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ORDER_START_DATE_FILTER,
    payload: startDate,
  });
};

export const updateOrderEndDate = (date) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ORDER_END_DATE_FILTER,
    payload: date,
  });
};

export const updateOrderType = (data) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ORDER_TYPE_FILTER,
    payload: data,
  });
};

export const updateOrderSearchKey = (search) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ORDER_SEARCH_KEY,
    payload: search,
  });
};

export const updateOrderByShopType = (type) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ORDER_BY_SHOP_TYPE,
    payload: type,
  });
};


// GET ACTIVE DELIVERY BOY


export const getAllActiveDeliveryMan =
  (orderId) =>
    async (dispatch, getState) => {

      try {
        dispatch({
          type: actionType.ACTIVE_DELIVERY_MANS_REQUEST_SEND,
        });

        const {
          data: { status, error, data = null },
        } = await requestApi().request(ACTIVE_DEIVERY_BOYS, {
          params: {
            orderId
          },
        });


        if (status) {
          dispatch({
            type: actionType.ACTIVE_DELIVERY_MANS_REQUEST_SUCCESS,
            payload: data?.nearByDeliveryBoys,
          });
        } else {
          dispatch({
            type: actionType.ACTIVE_DELIVERY_MANS_REQUEST_FAIL,
            payload: error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.ACTIVE_DELIVERY_MANS_REQUEST_FAIL,
          payload: error.message,
        });
      }

    };