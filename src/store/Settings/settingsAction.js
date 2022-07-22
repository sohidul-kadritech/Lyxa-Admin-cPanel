import { successMsg } from "../../helpers/successMsg";
import {
  ADD_ORDER_CANCEL_REASON,
  ADMINS_SETTINGS,
  ALL_ORDER_CANCEL_REASON,
  APP_SETTINGS,
  SET_DELIVERY_FEE,
  UPDATE_ADMINS_SETTINGS,
  UPDATE_APP_SETTINGS,
  UPDATE_ORDER_CANCEL_REASON,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// UPDATE GOOGLE MAP KEY
export const updateGoogleMapApiKey = (key) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_GOOGLE_KEY,
    payload: key,
  });
};

// UPDATE DELIVERY FEE PER/KM
export const updateDeliveryFee = (fee) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_DELIVERY_FEE,
    payload: fee,
  });
};

// SEARCH DELIVERY BOY DISTANCE KM
export const updateSearchDeliveryBoyKm = (km) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SEARCH_DELIVERY_BOY_KM,
    payload: km,
  });
};

export const removeSearchDeliveryBoyKm = (index) => (dispatch) => {
  dispatch({
    type: actionType.REMOVE_SEARCH_DELIVERY_BOY_KM,
    payload: index,
  });
};

// GET ALL ADMIN SETTINGS VALUE

export const getAllAdminSettings = () => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ALL_ADMIN_SETTINGS_REQUEST_SEND,
    });

    const {
      data: { status, error, data },
    } = await requestApi().request(ADMINS_SETTINGS);

    if (status) {
      dispatch({
        type: actionType.ALL_ADMIN_SETTINGS_REQUEST_SUCCESS,
        payload: data.adminSetting,
      });
    } else {
      dispatch({
        type: actionType.ALL_ADMIN_SETTINGS_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ALL_ADMIN_SETTINGS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// UPDATE ADMIN SETTINGS

export const updateAdminSettings = () => async (dispatch, getState) => {
  const { googleMapKey, deliveryFeePerKm, searchDeliveryBoyKm } =
    getState().settingsReducer;

  try {
    dispatch({
      type: actionType.UPDATE_ADMIN_SETTINGS_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data },
    } = await requestApi().request(UPDATE_ADMINS_SETTINGS, {
      method: "POST",
      data: {
        googleApiKey: googleMapKey,
        deliveryFeePerKm,
        searchDeliveryBoyKm,
      },
    });

    if (status) {
      successMsg(message, "success");
      dispatch({
        type: actionType.UPDATE_ADMIN_SETTINGS_REQUEST_SUCCESS,
        payload: data.adminSetting,
      });
    } else {
      successMsg(message, "error");
      dispatch({
        type: actionType.UPDATE_ADMIN_SETTINGS_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.UPDATE_ADMIN_SETTINGS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// UPDATE NEAR SHOP DISTANCE KEY

export const updateNearByShopKey = (distance) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_NEAR_BY_SHOP,
    payload: distance,
  });
};

// UPDATE APP SETTINGS

export const updateAppSettings = () => async (dispatch, getState) => {
  const { nearByShopKm } = getState().settingsReducer;
  try {
    dispatch({
      type: actionType.UPDATE_APP_SETTINGS_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data },
    } = await requestApi().request(UPDATE_APP_SETTINGS, {
      method: "POST",
      data: {
        nearByShopKm,
      },
    });

    if (status) {
      successMsg(message, "success");
      dispatch({
        type: actionType.UPDATE_APP_SETTINGS_REQUEST_SUCCESS,
        payload: data.adminSetting,
      });
    } else {
      successMsg(message, "error");
      dispatch({
        type: actionType.UPDATE_APP_SETTINGS_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.UPDATE_APP_SETTINGS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL APP SETTINGS

export const getAllAppSettings = () => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ALL_APP_SETTINGS_REQUEST_SEND,
    });

    const {
      data: { status, error, data },
    } = await requestApi().request(APP_SETTINGS);

    if (status) {
      dispatch({
        type: actionType.ALL_APP_SETTINGS_REQUEST_SUCCESS,
        payload: data.appSetting,
      });
    } else {
      dispatch({
        type: actionType.ALL_APP_SETTINGS_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ALL_APP_SETTINGS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// ADD DELIVERY CHARGE

export const addDeliveryCharge = (values) => async (dispatch) => {
  console.log({ values });
  try {
    dispatch({
      type: actionType.ADD_DELIVERY_FEE_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SET_DELIVERY_FEE, {
      method: "POST",
      data: values,
    });

    console.log({ data: data });

    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_DELIVERY_FEE_REQUEST_SUCCESS,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_DELIVERY_FEE_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_DELIVERY_FEE_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// ADD CANCELATION REASON

export const addCancelReason = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_REASON_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_ORDER_CANCEL_REASON, {
      method: "POST",
      data: values,
    });

    console.log({ data: data });

    if (data.status) {
      const { cancelReason } = data.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_REASON_REQUEST_SUCCESS,
        payload: cancelReason,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_REASON_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_REASON_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// UPDATE CANCEL REASON

export const updateCancelReason = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.UPDATE_REASON_REQUEST_SEND,
    });

    const { data } = await requestApi().request(UPDATE_ORDER_CANCEL_REASON, {
      method: "POST",
      data: values,
    });

    console.log({ data: data });

    if (data.status) {
      const { cancelReason } = data.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.UPDATE_REASON_REQUEST_SUCCESS,
        payload: cancelReason,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.UPDATE_REASON_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.UPDATE_REASON_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL CANCEL REASONS

export const getAllCancelReasons =
  (refresh = false) =>
  async (dispatch, getState) => {
    const { cancelReasons, typeKey, activeStatus } = getState().settingsReducer;

    if (refresh || cancelReasons.length > 1) {
      try {
        dispatch({
          type: actionType.ALL_REASONS_REQUEST_SEND,
        });

        const {
          data: { status, error, data },
        } = await requestApi().request(ALL_ORDER_CANCEL_REASON, {
          params: {
            type: typeKey,
            status: activeStatus,
          },
        });

        if (status) {
          dispatch({
            type: actionType.ALL_REASONS_REQUEST_SUCCESS,
            payload: data.cancelReason,
          });
        } else {
          dispatch({
            type: actionType.ALL_REASONS_REQUEST_FAIL,
            payload: error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.ALL_REASONS_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// CANCEL REASON TYPE UPDATE

export const updateReasonTypeKey = (type) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_REASON_TYPE_KEY,
    payload: type,
  });
};

// CANCEL REASON STATUS UPDATE

export const updateReasonStatusKey = (status) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_REASON_STATUS_KEY,
    payload: status,
  });
};
