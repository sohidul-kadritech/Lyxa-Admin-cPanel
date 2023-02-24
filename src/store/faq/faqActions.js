/* eslint-disable no-unused-vars */
import { ADD_FAQ, DELETE_FAQ, GET_FAQ, UPDATE_FAQ } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionTypes from '../actionType';

// get all faqs
export const getAllFaq = () => async (dispatch, getState) => {
  const state = getState();
  const { page, paging, pagingRange } = state.faqReducer.pagination;

  dispatch({
    type: actionTypes.GET_ALL_FAQ_REQUEST_SEND,
  });
  try {
    const { data } = await requestApi().request(GET_FAQ, {
      method: 'GET',
      params: {
        page,
        paging,
        pagingRange,
      },
    });

    if (data?.status) {
      dispatch({
        type: actionTypes.GET_ALL_FAQ_REQUEST_SUCCESS,
        payload: data?.data?.list,
      });
    } else {
      dispatch({
        type: actionTypes.GET_ALL_FAQ_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_ALL_FAQ_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

// update faq
export const updateFaq = (faq) => async (dispatch, getState) => {
  const state = getState();
  const { faq: storedList } = state.faqReducer;

  dispatch({
    type: actionTypes.UPDATE_FAQ_REQUEST_SEND,
  });
  try {
    const { data } = await requestApi().request(UPDATE_FAQ, {
      method: 'POST',
      data: faq,
    });

    if (data?.status) {
      // update list locally
      const updatedList = storedList.filter((item) => item._id !== faq._id);
      updatedList.push(faq);

      dispatch({
        type: actionTypes.UPDATE_FAQ_REQUEST_SUCCESS,
        payload: updatedList,
      });
    } else {
      dispatch({
        type: actionTypes.UPDATE_FAQ_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.UPDATE_FAQ_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

// add faq
export const addFaq = (faq) => async (dispatch, getState) => {
  const state = getState();
  const { faq: storedList } = state.faqReducer;

  dispatch({
    type: actionTypes.ADD_FAQ_REQUEST_SEND,
  });

  try {
    const { data } = await requestApi().request(ADD_FAQ, {
      method: 'POST',
      data: faq,
    });

    console.log(data);

    if (data?.status) {
      dispatch({
        type: actionTypes.ADD_FAQ_REQUEST_SUCCESS,
        payload: data?.data,
      });
    } else {
      dispatch({
        type: actionTypes.ADD_FAQ_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.ADD_FAQ_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

// add faq
export const deleteFaq = (id) => async (dispatch, getState) => {
  const state = getState();
  const { faq: storedList } = state.faqReducer;

  dispatch({
    type: actionTypes.DELETE_FAQ_REQUEST_SEND,
  });

  try {
    const { data } = await requestApi().request(DELETE_FAQ, {
      method: 'POST',
      data: { id },
    });

    console.log(data);

    if (data?.status) {
      console.log(storedList, id);
      const updatedList = storedList.filter((item) => item._id !== id);

      dispatch({
        type: actionTypes.DELETE_FAQ_REQUEST_SUCCESS,
        payload: updatedList,
      });
    } else {
      dispatch({
        type: actionTypes.DELETE_FAQ_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.DELETE_FAQ_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};
