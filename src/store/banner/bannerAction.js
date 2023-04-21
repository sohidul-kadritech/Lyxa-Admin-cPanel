import { successMsg } from '../../helpers/successMsg';
import { ADD_BANNER, BANNER_LIST, DELETE_BANNER, EDIT_BANNER } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionType from '../actionType';
import { DELETE_BANNER_REQUEST_FAIL, DELETE_BANNER_REQUEST_SEND, DELETE_BANNER_REQUEST_SUCCESS } from '../actionType';

// DELETE BANNER REQUEST

export const deleteBanner = (id) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_BANNER_REQUEST_SEND,
    });

    const {
      data: { message, error, status },
    } = await requestApi().request(DELETE_BANNER, {
      method: 'POST',
      data: {
        id,
      },
    });

    if (status) {
      successMsg(message, 'success');
      dispatch({
        type: DELETE_BANNER_REQUEST_SUCCESS,
        payload: id,
      });
    } else {
      successMsg(message, 'error');
      dispatch({
        type: DELETE_BANNER_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: DELETE_BANNER_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const getBannerListAction =
  (refresh = false) =>
  async (dispatch, getState) => {
    try {
      const { list, type } = getState().bannerReducer;

      if (list.length <= 0 || refresh) {
        dispatch({
          type: actionType.BANNER_REQUEST_SEND,
        });

        const request = requestApi();
        const { data } = await request(BANNER_LIST, {
          params: {
            type,
          },
        });

        if (data.status) {
          dispatch({
            type: actionType.BANNER_REQUEST_SUCCESS,
            payload: data.data.banners,
          });
        } else {
          dispatch({
            type: actionType.BANNER_REQUEST_FAIL,
            payload: data.error,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: actionType.BANNER_REQUEST_FAIL,
        payload: error.message,
      });
    }
  };

// ADD BANNER

export const addBanner = (addData) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.BANNER_ADD_REQUEST_SENT,
    });

    const { data } = await requestApi().request(ADD_BANNER, {
      method: 'POST',
      data: addData,
    });

    if (data.status) {
      successMsg(data.message, 'success');

      dispatch({
        type: actionType.BANNER_ADD_REQUEST_SUCCESS,
        payload: data.data.banner,
      });
    } else {
      successMsg(data.message, 'error');
      dispatch({
        type: actionType.BANNER_ADD_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.BANNER_ADD_REQUEST_FAIL,
      payload: error,
    });
  }
};

export const filterSelect = (filter) => async (dispatch) => {
  dispatch({
    type: actionType.BANNER_FILTER_SELECT,
    payload: filter,
  });
};

// EDIT BANNER REQUEST
export const editBanner = (bannerData) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.EDIT_BANNER_REQUEST_SEND,
    });

    const { data } = await requestApi().request(EDIT_BANNER, {
      method: 'POST',
      data: bannerData,
    });

    if (data.status) {
      successMsg(data.message, 'success');
      setTimeout(() => {
        dispatch({
          type: actionType.GET_EDITED_BANNER,
          payload: data.data.banner,
        });
      }, [450]);
    } else {
      successMsg(data.error, 'error');
      dispatch({
        type: actionType.EDIT_BANNER_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    successMsg(error.message, 'error');
    dispatch({
      type: actionType.EDIT_BANNER_REQUEST_FAIL,
      payload: error,
    });
  }
};
