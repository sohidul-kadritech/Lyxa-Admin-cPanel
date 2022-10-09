import { toast } from "react-toastify";
import { successMsg } from "../../helpers/successMsg";
import {
  ADD_DELIVERY_MAN,
  ALL_DELIVERY_MAN,
  DELIVERY_BOY_ORDERS,
  EDIT_DELIVERY_MAN,
  TRACK_DELIVERY_MAN,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// ADD
export const addDeliveryMan = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_DELIVERY_MAN_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data = null },
    } = await requestApi().request(ADD_DELIVERY_MAN, {
      method: "POST",
      data: values,
    });

    if (status) {
      successMsg(message, "success");

      dispatch({
        type: actionType.ADD_DELIVERY_MAN_REQUEST_SUCCESS,
        payload: data.deliveryBoyFinal,
      });
    } else {
      successMsg(error, "error");

      dispatch({
        type: actionType.ADD_DELIVERY_MAN_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_DELIVERY_MAN_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL

export const allDeliveryMan =
  (refresh, page = 1) =>
    async (dispatch, getState) => {
      const { deliveryMans, sortByKey, statusKey, searchKey, liveStatus } =
        getState().deliveryManReducer;

      if (refresh || deliveryMans.length < 1) {
        try {
          dispatch({
            type: actionType.ALL_DELIVERY_MAN_REQUEST_SEND,
          });

          const {
            data: { status, error, data = null },
          } = await requestApi().request(ALL_DELIVERY_MAN, {
            params: {
              page,
              pageSize: 50,
              searchKey,
              sortBy: sortByKey.value,
              status: statusKey.value,
              liveStatus: liveStatus.value
            },
          });



          if (status) {
            dispatch({
              type: actionType.ALL_DELIVERY_MAN_REQUEST_SUCCESS,
              payload: data,
            });
          } else {
            dispatch({
              type: actionType.ALL_DELIVERY_MAN_REQUEST_FAIL,
              payload: error,
            });
          }
        } catch (error) {
          dispatch({
            type: actionType.ALL_DELIVERY_MAN_REQUEST_FAIL,
            payload: error.message,
          });
        }
      }
    };

//   EDIT

export const editDeliveryMan = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.EDIT_DELIVERY_MAN_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data = null },
    } = await requestApi().request(EDIT_DELIVERY_MAN, {
      method: "POST",
      data: values,
    });

    if (status) {
      successMsg(message, "success");

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_DELIVERY_MAN_REQUEST_SUCCESS,
          payload: data.delivery,
        });
      }, [450]);
    } else {
      successMsg(error, "error");

      dispatch({
        type: actionType.EDIT_DELIVERY_MAN_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_DELIVERY_MAN_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// TRACKING DELIVERY Boy

export const trackDeliveryBoy =
  (id, page = 1) =>
    async (dispatch, getState) => {

      const { startDate, endDate } = getState().deliveryManReducer;

      try {
        dispatch({
          type: actionType.TRACK_DELIVERY_MAN_REQUEST_SEND,
        });

        const {
          data: { status, error, message, data = null },
        } = await requestApi().request(TRACK_DELIVERY_MAN, {
          params: {
            id,
            page,
            pageSize: 15,
            startDate,
            endDate
          },
        });




        if (status) {
          dispatch({
            type: actionType.TRACK_DELIVERY_MAN_REQUEST_SUCCESS,
            payload: data,
          });
        } else {
          successMsg(error, "error");

          dispatch({
            type: actionType.TRACK_DELIVERY_MAN_REQUEST_FAIL,
            payload: error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.TRACK_DELIVERY_MAN_REQUEST_FAIL,
          payload: error.message,
        });
      }
    };


export const updateActivityStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ACTIVITY_START_DATE,
    payload: startDate,
  });
};

export const updateRiderLiveStatus = (status) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_RIDER_LIVE_STATUS,
    payload: status,
  });
};

export const updateActivityEndDate = (date) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ACTIVITY_END_DATE,
    payload: date,
  });
};

//   SORT BY KEY

export const updateDeliveryManSortByKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SORT_BY_KEY,
    payload: value,
  });
};

// UPDATE SELLER STATUS

export const updateDeliveryManStatusKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_STATUS_KEY,
    payload: value,
  });
};

// UPDATE SEARCH KEY

export const updateDeliveryManSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SEARCH_KEY,
    payload: value,
  });
};

export const setDeliveryStatusFalse = () => (dispatch) => {
  dispatch({
    type: actionType.SET_STATUS_FALSE,
  });
};

// ORDER LIST

export const getDeliveryAllOrder =
  (refresh = false, deliveryId, page = 1) =>
    async (dispatch, getState) => {
      const { orders } = getState().deliveryManReducer;

      if (orders.length < 1 || refresh) {
        try {
          dispatch({
            type: actionType.DELIVERYBOY_ORDERS_REQUEST_SEND,
          });

          const {
            data: { status, error, data = null },
          } = await requestApi().request(DELIVERY_BOY_ORDERS, {
            params: {
              deliveryId,
              page,
              pageSize: 50,
            },
          });



          if (status) {
            dispatch({
              type: actionType.DELIVERYBOY_ORDERS_REQUEST_SUCCESS,
              payload: data,
            });
          } else {
            dispatch({
              type: actionType.DELIVERYBOY_ORDERS_REQUEST_FAIL,
              payload: error,
            });
          }
        } catch (error) {
          dispatch({
            type: actionType.DELIVERYBOY_ORDERS_REQUEST_FAIL,
            payload: error.message,
          });
        }
      }
    };
