import { successMsg } from "../../helpers/successMsg";
import {
  CREATE_NOTIFICATION,
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATION_STATUS,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

export const createNotification = (values) => async (dispatch) => {
  console.log({ values });
  try {
    dispatch({
      type: actionType.CREATE_NOTIFICATION_REQUEST_SEND,
    });

    const { data } = await requestApi().request(CREATE_NOTIFICATION, {
      method: "POST",
      data: values,
    });

    console.log(data);

    if (data.status) {
      successMsg(data.message, "success");
      const { notification } = data.data;
      dispatch({
        type: actionType.CREATE_NOTIFICATION_REQUEST_SUCCESS,
        payload: notification,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.CREATE_NOTIFICATION_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    successMsg("Something went wrong");
    dispatch({
      type: actionType.CREATE_NOTIFICATION_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const getAllNotifications =
  (refresh = false, page = 1) =>
  async (dispatch, getState) => {
    const { notifications, activeStatus, type, accountType } =
      getState().notificationReducer;

    if (notifications.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.ALL_NOTIFICATIONS_REQUEST_SEND,
        });

        const { data } = await requestApi().request(GET_NOTIFICATIONS, {
          params: {
            page: page,
            pageSize: 50,
            status: activeStatus.value,
            type: type.value,
            accountType: accountType.value,
          },
        });

        if (data.status) {
          dispatch({
            type: actionType.ALL_NOTIFICATIONS_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionType.ALL_NOTIFICATIONS_REQUEST_FAIL,
            payload: data.message,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.ALL_NOTIFICATIONS_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// UPDATE STATUS

export const updateNotificationStatus = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.UPDATE_NOTIFICATION_STATUS_REQUEST_SEND,
    });

    const { data } = await requestApi().request(UPDATE_NOTIFICATION_STATUS, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.UPDATE_NOTIFICATION_STATUS_REQUEST_SUCCESS,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.UPDATE_NOTIFICATION_STATUS_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    successMsg("Something went wrong");
    dispatch({
      type: actionType.UPDATE_NOTIFICATION_STATUS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const updateNotificationActiveStatus = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_NOTIFICATION_ACTIVE_STATUS,
    payload: value,
  });
};

export const updateNotificationAccountType = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_NOTIFICATION_ACCOUNT_TYPE,
    payload: value,
  });
};

export const updateNotificationType = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_NOTIFICATION_TYPE,
    payload: value,
  });
};
