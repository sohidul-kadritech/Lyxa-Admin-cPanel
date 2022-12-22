import { ADD_BANNER, BANNER_LIST, DELETE_BANNER } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";
import {
  DELETE_BANNER_REQUEST_SEND,
  DELETE_BANNER_REQUEST_SUCCESS,
  GET_DELETED_BANNER_DATA,
  DELETE_BANNER_REQUEST_FAIL,
} from "./../actionType";
import { EDIT_BANNER } from "./../../network/Api";
import { successMsg } from "../../helpers/successMsg";

// DELETE BANNER REQUEST

export const deleteBanner = (id) => async (dispatch) => {
  // console.log(id)
  try {
    dispatch({
      type: DELETE_BANNER_REQUEST_SEND,
    });

    const {
      data: { message, error, status },
    } = await requestApi().request(DELETE_BANNER, {
      method: "POST",
      data: {
        id,
      },
    });
    // console.log({ status });

    if (status) {
      successMsg(message, 'success')
      dispatch({
        type: DELETE_BANNER_REQUEST_SUCCESS,
        payload: id,
      });
    } else {
      successMsg(message, 'error')
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
            type: type,
          },
        });

        // console.log(data);

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

export const addBanner = (addData) => async (dispatch, getState) => {
  // console.log({ addData });
  try {
    dispatch({
      type: actionType.BANNER_ADD_REQUEST_SENT,
    });

    const { data } = await requestApi().request(ADD_BANNER, {
      method: "POST",
      data: addData,
    });

    // console.log({ data });

    if (data.status) {
      successMsg(data.message, 'success')

      dispatch({
        type: actionType.BANNER_ADD_REQUEST_SUCCESS,
        payload: data.data.banner,
      });
    } else {
      successMsg(data.message, 'error')
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
  // console.log({ filter });
  dispatch({
    type: actionType.BANNER_FILTER_SELECT,
    payload: filter,
  });

  // dispatch(getBannerListAction({ refresh: true }));
};

// EDIT BANNER REQUEST

export const editBanner = (bannerData) => async (dispatch) => {
  //   console.log(banner);
  try {
    dispatch({
      type: actionType.EDIT_BANNER_REQUEST_SEND,
    });

    const { data } = await requestApi().request(EDIT_BANNER, {
      method: "POST",
      data: bannerData,
    });
    // console.log({ data });

    if (data.status) {
      successMsg(data.message, 'success')
      setTimeout(() => {
        dispatch({
          type: actionType.GET_EDITED_BANNER,
          payload: data.data.banner,
        });
      }, [450]);
    } else {
      successMsg(data.error, 'error')
      dispatch({
        type: actionType.EDIT_BANNER_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    successMsg(error.message, 'error')
    dispatch({
      type: actionType.EDIT_BANNER_REQUEST_FAIL,
      payload: error,
    });
  }
};
