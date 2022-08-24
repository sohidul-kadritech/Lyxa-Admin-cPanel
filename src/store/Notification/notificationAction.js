import { successMsg } from "../../helpers/successMsg";
import { CREATE_NOTIFICATION, GET_NOTIFICATIONS } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

export const createNotification = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.CREATE_NOTIFICATION_REQUEST_SEND,
    });

    const { data } = await requestApi().request(CREATE_NOTIFICATION, {
      method: "POST",
      data: values,
    });

    // console.log(data);

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
    const { notifications } = getState().notificationReducer;

    if (notifications.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.ALL_NOTIFICATIONS_REQUEST_SEND,
        });

        const { data } = await requestApi().request(GET_NOTIFICATIONS, {
          params: {
            page: page,
            pageSize: 50,
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
