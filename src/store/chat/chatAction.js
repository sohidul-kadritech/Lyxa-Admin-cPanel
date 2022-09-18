import { toast } from "react-toastify";
import { ACCEPT_CHAT, CHAT_LIST, REJECT_CHAT, SEND_MESSAGE } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

export const getAllChat =
  (refresh = false, page) =>
    async (dispatch, getState) => {
      const { chatRequests, typeKey, sortByKey } = getState().chatReducer;

      if (chatRequests.length < 1 || refresh) {
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
              sortBy: sortByKey.value,
              type: typeKey.value,
            },
          });


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

export const acceptChatReq = (id) => async (dispatch) => {
  console.log({ id })
  try {
    dispatch({
      type: actionType.ACCEPT_CHAT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ACCEPT_CHAT, {
      method: "POST",
      data: { id },
    });



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
      dispatch({
        type: actionType.ACCEPT_CHAT_REQUEST_SUCCESS,
        payload: data?.data?.request,
      });
    } else {
      toast.success(data.error, {
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
      dispatch({
        type: actionType.REJECT_CHAT_REQUEST_SUCCESS,
        payload: data?.data?.request,
      });
    } else {
      toast.success(data.error, {
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

export const sendMsgToUser = (values) => async (dispatch) => {
  console.log({ values });
  try {
    dispatch({
      type: actionType.SEND_MSG_TO_USER_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SEND_MESSAGE, {
      method: "POST",
      data: values,
    });


    // console.log({ data });

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
      dispatch({
        type: actionType.SEND_MSG_TO_USER_REQUEST_SUCCESS,
        payload: data?.data?.request,
      });
    } else {
      toast.success(data.error, {
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
