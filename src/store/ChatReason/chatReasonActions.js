/* eslint-disable no-unused-vars */
import { ADD_CHAT_REASON, DELETE_CHAT_REASON, GET_CHAT_REASON, UPDATE_CHAT_REASON } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionTypes from '../actionType';

// get all faqs
export const getAllChatReason = () => async (dispatch, getState) => {
  const state = getState();

  dispatch({
    type: actionTypes.GET_ALL_CHAT_REASON_REQUEST_SEND,
  });
  try {
    const { data } = await requestApi().request(GET_CHAT_REASON, {
      method: 'GET',
    });

    if (data?.status) {
      dispatch({
        type: actionTypes.GET_ALL_CHAT_REASON_REQUEST_SUCCESS,
        payload: data?.data?.chatReason,
      });
    } else {
      dispatch({
        type: actionTypes.GET_ALL_CHAT_REASON_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_ALL_CHAT_REASON_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

// update faq
export const updateChatReason = (chatReason) => async (dispatch, getState) => {
  const state = getState();
  const { chatReasons: chatReasonsList } = state.chatReasonReducer;

  // faq id
  chatReason.id = chatReason?._id;

  dispatch({
    type: actionTypes.UPDATE_CHAT_REASON_REQUEST_SEND,
  });
  try {
    const { data } = await requestApi().request(UPDATE_CHAT_REASON, {
      method: 'POST',
      data: chatReason,
    });

    if (data?.status) {
      // update list locally
      const updatedList = chatReasonsList.filter((item) => item._id !== chatReason._id);
      updatedList.push(data?.data?.chatReason);

      dispatch({
        type: actionTypes.UPDATE_CHAT_REASON_REQUEST_SUCCESS,
        payload: updatedList,
      });
    } else {
      dispatch({
        type: actionTypes.UPDATE_CHAT_REASON_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.UPDATE_CHAT_REASON_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

// add faq
export const addChatReason = (chatReason) => async (dispatch, getState) => {
  const state = getState();
  const { chatReasons: storedList } = state.chatReasonReducer;

  dispatch({
    type: actionTypes.ADD_CHAT_REASON_REQUEST_SEND,
  });

  try {
    const { data } = await requestApi().request(ADD_CHAT_REASON, {
      method: 'POST',
      data: {
        type: chatReason.type,
        question: chatReason.question.trim(),
        answer: chatReason.answer.trim(),
      },
    });

    if (data?.status) {
      dispatch({
        type: actionTypes.ADD_CHAT_REASON_REQUEST_SUCCESS,
        payload: data?.data?.chatReason,
      });
    } else {
      dispatch({
        type: actionTypes.ADD_CHAT_REASON_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.ADD_CHAT_REASON_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

// add faq
export const deleteChatReason = (id) => async (dispatch, getState) => {
  const state = getState();
  const { chatReasons: storedList } = state.chatReasonReducer;

  dispatch({
    type: actionTypes.DELETE_CHAT_REASON_REQUEST_SEND,
  });

  try {
    const { data } = await requestApi().request(DELETE_CHAT_REASON, {
      method: 'POST',
      data: { id },
    });

    console.log(data);

    if (data?.status) {
      console.log(storedList, id);
      const updatedList = storedList.filter((item) => item._id !== id);

      dispatch({
        type: actionTypes.DELETE_CHAT_REASON_REQUEST_SUCCESS,
        payload: updatedList,
      });
    } else {
      dispatch({
        type: actionTypes.DELETE_CHAT_REASON_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.DELETE_CHAT_REASON_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

// update is added
export const updateChatReasonIsUpdated = (status) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_CHAT_REASON_IS_UPDATED,
    payload: status,
  });
};

// update is added
export const updateChatReasonIsAdded = (status) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_CHAT_REASON_IS_ADDED,
    payload: status,
  });
};
