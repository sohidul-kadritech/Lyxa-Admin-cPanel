import { toast } from "react-toastify";
import { successMsg } from "../../helpers/successMsg";
import {
  ACCEPT_CHAT,
  CHAT_LIST,
  CLOSE_CONVERSATION,
  REJECT_CHAT,
  SEND_MESSAGE,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

export const getAllChat =
  (refresh = false, userId, shopId, page = 1) =>
  async (dispatch, getState) => {
    const { chatRequests, orderChatSearchKey } = getState().chatReducer;

    if (chatRequests?.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.ALL_CHAT_REQUEST_SEND,
        });

        const {
          data: { status, error, data = null },
        } = await requestApi().request(CHAT_LIST, {
          params: {
            page,
            pageSize: 50,
            userId,
            shopId,
            searchKey: orderChatSearchKey,
          },
        });
        console.log("order chat data", data);
        if (status) {
          dispatch({
            type: actionType.ALL_CHAT_REQUEST_SUCCESS,
            payload: data,
          });
        } else {
          dispatch({
            type: actionType.ALL_CHAT_REQUEST_FAIL,
            payload: error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.ALL_CHAT_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// ACCEPT USER CHAT REQUEST

export const acceptChatReq = (id) => async (dispatch, getState) => {
  const { socket } = getState().socketReducer;
  try {
    dispatch({
      type: actionType.ACCEPT_CHAT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ACCEPT_CHAT, {
      method: "POST",
      data: { id },
    });

    if (data.status) {
      successMsg(data?.message, "success");
      const { request } = data?.data;
      dispatch({
        type: actionType.ACCEPT_CHAT_REQUEST_SUCCESS,
        payload: request,
      });
      socket.emit("admin_accepted_chat_request", { requestId: request?._id });
    } else {
      successMsg(data?.error, "error");
      dispatch({
        type: actionType.ACCEPT_CHAT_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ACCEPT_CHAT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// REJECT CHAT REQUEST

export const rejectChatReq = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.REJECT_CHAT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(REJECT_CHAT, {
      method: "POST",
      data: { id },
    });

    if (data.status) {
      successMsg(data?.message, "success");
      dispatch({
        type: actionType.REJECT_CHAT_REQUEST_SUCCESS,
        payload: data?.data?.request,
      });
    } else {
      successMsg(data?.error, "error");
      dispatch({
        type: actionType.REJECT_CHAT_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.REJECT_CHAT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// SEND MESSEGE TO USER

export const sendMsgToUser = (values) => async (dispatch, getState) => {
  const { socket } = getState().socketReducer;
  try {
    dispatch({
      type: actionType.SEND_MSG_TO_USER_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SEND_MESSAGE, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      // successMsg(data?.message, "success");
      const { request } = data?.data;
      dispatch({
        type: actionType.SEND_MSG_TO_USER_REQUEST_SUCCESS,
        payload: request,
      });
      socket.emit("admin_message_sent", { room: values?.id });
    } else {
      successMsg(data?.error, "error");
      dispatch({
        type: actionType.SEND_MSG_TO_USER_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ACCEPT_CHAT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// CLOSE CONVERSATION

export const closeConversation = (id) => async (dispatch, getState) => {
  const { socket } = getState().socketReducer;

  try {
    dispatch({
      type: actionType.CLOSE_CONVERSATION_REQUEST_SEND,
    });

    const { data } = await requestApi().request(CLOSE_CONVERSATION, {
      method: "POST",
      data: { requestId: id },
    });

    if (data.status) {
      successMsg(data?.message, "success");
      dispatch({
        type: actionType.CLOSE_CONVERSATION_REQUEST_SUCCESS,
      });
      socket.emit("chat-close", { requestId: id });
    } else {
      successMsg(data?.error, "error");
      dispatch({
        type: actionType.CLOSE_CONVERSATION_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.CLOSE_CONVERSATION_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// FITLERS

export const updateChatSortByKey = (type) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_CHAT_SORT_BY_FILTER,
    payload: type,
  });
};

export const updateChatType = (data) => (dispatch) => {
  // console.log({ date });
  dispatch({
    type: actionType.UPDATE_CHAT_TYPE_FILTER,
    payload: data,
  });
};

export const selectDefaultMsg = (msg) => (dispatch) => {
  dispatch({
    type: actionType.SELECT_DEFAULT_MSG,
    payload: msg,
  });
};

export const setChatStatusFalse = () => (dispatch) => {
  dispatch({
    type: actionType.SET_STATUS_FALSE,
  });
};

// ORDER CHAT LIST SEARCH KEY

export const updateOrderChatSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ORDER_CHAT_SEARCH_KEY,
    payload: value,
  });
};
