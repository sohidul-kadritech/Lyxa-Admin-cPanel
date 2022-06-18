
import { successMsg } from "../../helpers/successMsg";
import {
  ADMINS_SETTINGS,
  APP_SETTINGS,
  UPDATE_ADMINS_SETTINGS,
  UPDATE_APP_SETTINGS,
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
        successMsg(message, "success")
      dispatch({
        type: actionType.UPDATE_ADMIN_SETTINGS_REQUEST_SUCCESS,
        payload: data.adminSetting,
      });
    } else {
        successMsg(message, "error")
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
