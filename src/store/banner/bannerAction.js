import { ADD_BANNER, BANNER_LIST, DELETE_BANNER } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";
import {
  DELETE_BANNER_REQUEST_SEND,
  DELETE_BANNER_REQUEST_SUCCESS,
  GET_DELETED_BANNER_DATA,
  DELETE_BANNER_REQUEST_FAIL
} from "./../actionType";
import { EDIT_BANNER } from "./../../network/Api";
import { toast } from "react-toastify";

export const deleteBannerRequestSend = () => {
  return {
    type: DELETE_BANNER_REQUEST_SEND
  };
};

export const deleteBannerRequestSuccess = (message, id) => {
  return {
    type: DELETE_BANNER_REQUEST_SUCCESS,
    payload: { message, id }
  };
};

export const deleteBannerRequestFail = error => {
  return {
    type: DELETE_BANNER_REQUEST_FAIL,
    payload: error
  };
};

// DELETE BANNER REQUEST

export const deleteBanner = id => async dispatch => {
  // console.log(id)
  try {
    dispatch(deleteBannerRequestSend());

    const {
      data: { message, error, status }
    } = await requestApi().request(DELETE_BANNER, {
      method: "POST",
      data: {
        id: id
      }
    });
    // console.log(data)

    if (status) {
      dispatch(deleteBannerRequestSuccess(id));
    } else {
      dispatch(deleteBannerRequestFail(error));
    }
  } catch (error) {
    dispatch(deleteBannerRequestFail(error));
  }
};

export const getBannerListAction = ({ refresh = false }) => async (
  dispatch,
  getState
) => {
  try {
    const {
      list,
      type,
      activeStatus: status,
      sortBy
    } = getState().bannerReducer;

    if (list.length <= 0 || refresh) {
      dispatch({
        type: actionType.BANNER_REQUEST_SEND
      });

      const request = requestApi();
      const { data } = await request(BANNER_LIST, {
        params: {
          type: type,
          status: status,
          sortBy: sortBy
        }
      });

      // console.log(data);

      if (data.status) {
        dispatch({
          type: actionType.BANNER_REQUEST_SUCCESS,
          payload: data.data.banners
        });
      } else {
        dispatch({
          type: actionType.BANNER_REQUEST_FAIL,
          payload: data.error
        });
      }
    }
  } catch (error) {
    dispatch({
      type: actionType.BANNER_REQUEST_FAIL,
      payload: error.message
    });
  }
};

// ADD BANNER

export const addBanner = addData => async (dispatch, getState) => {
  try {
    dispatch({
      type: actionType.BANNER_ADD_REQUEST_SENT
    });

    const { data } = await requestApi().request(ADD_BANNER, {
      method: "POST",
      data: addData
    });

    if (data.status) {
      const banner = data.data.banner;

      if (banner.type == getState().bannerReducer.type) {
        dispatch({
          type: actionType.BANNER_ADD_REQUEST_SUCCESS,
          payload: {
            banner: data.data.banner,
            message: data.message
          }
        });
      } else {
        // dispatch({
        //     type:actionType.BANNER_FILTER_SELECT,
        //     payload:{
        //         type:banner.type
        //     }
        // })

        dispatch({
          type: actionType.BANNER_ADD_REQUEST_SUCCESS,
          payload: {
            banner: [],
            message: data.message,
            filter: {
              type: banner.type
            }
          }
        });
      }

      toast.success(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });

      dispatch({ type: actionType.BANNER_MESSAGE_CLEAR });
    } else {
      dispatch({
        type: actionType.BANNER_ADD_REQUEST_FAIL,
        payload: data.error
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.BANNER_ADD_REQUEST_FAIL,
      payload: error
    });
  }
};

export const filterSelect = filter => async dispatch => {
  dispatch({
    type: actionType.BANNER_FILTER_SELECT,
    payload: filter
  });

  dispatch(getBannerListAction({ refresh: true }));
};

// EDIT BANNER REQUEST

export const editBanner = bannerData => async dispatch => {
  //   console.log(banner);
  try {
    dispatch({
      type: actionType.EDIT_BANNER_REQUEST_SEND
    });

    const { data } = await requestApi().request(EDIT_BANNER, {
      method: "POST",
      data: bannerData
    });
    // console.log(data);

    if (data.status) {
      dispatch({
        type: actionType.GET_EDITED_BANNER,
        payload: {
          banner: data.data.banner,
          message: data.message
        }
      });

      // toast.success(data.message+"===", {
      //     // position: "bottom-right",
      //     position: toast.POSITION.BOTTOM_RIGHT,
      //     autoClose: 3000,
      //     hideProgressBar: true,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      // });
      dispatch({ type: actionType.BANNER_MESSAGE_CLEAR });
    } else {
      dispatch({
        type: actionType.EDIT_BANNER_REQUEST_FAIL,
        payload: data.error
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_BANNER_REQUEST_FAIL,
      payload: error
    });
  }
};
