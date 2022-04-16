import {
  ADD_ADMIN,
  DELETE_ADMIN,
  EDIT_ADMIN,
  GET_ALL_ADMIN,
} from "../../../network/Api";
import * as actionType from "../../actionType";
import requestApi from "./../../../network/httpRequest";
import { toast } from "react-toastify";

// ADD

export const addAdmin = (adminData) => async (dispatch) => {
  // console.log({adminData})
  try {
    dispatch({
      type: actionType.ADD_ADMIN_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_ADMIN, {
      method: "POST",
      data: adminData,
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
        type: actionType.ADD_ADMIN_REQUEST_SUCCESS,
        payload: data.data.addAdmin,
      });
    } else {
      toast.warn(data.message, {
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
        type: actionType.ADD_ADMIN_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_ADMIN_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL_

export const getAllAdmin =
  (refresh = false) =>
  async (dispatch, getState) => {
    // console.log({adminData})
    const { admins } = getState().adminReducer;

    if (admins.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.GET_ALL_ADMIN_REQUEST_SEND,
        });

        const { data } = await requestApi().request(GET_ALL_ADMIN);

        console.log({ data });

        if (data.status) {
          dispatch({
            type: actionType.GET_ALL_ADMIN_REQUEST_SUCCESS,
            payload: data.data.admins,
          });
        } else {
          dispatch({
            type: actionType.GET_ALL_ADMIN_REQUEST_FAIL,
            payload: data.message,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.GET_ALL_ADMIN_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// DELETE

export const deleteAdmin = (value) => async (dispatch) => {
  // console.log({adminData})

  try {
    dispatch({
      type: actionType.DELETE_ADMIN_REQUEST_SEND,
    });

    const { data } = await requestApi().request(DELETE_ADMIN, {
      method: "POST",
      data: value,
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
        type: actionType.DELETE_ADMIN_REQUEST_SUCCESS,
        payload: data?.data?.admin,
      });
    } else {
      toast.warn(data.message, {
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
        type: actionType.DELETE_ADMIN_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_ADMIN_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// EDIT

export const editAdmin = (values) => async (dispatch) => {
  console.log({ values });
  try {
    dispatch({
      type: actionType.EDIT_ADMIN_REQUEST_SEND,
    });

    const { data } = await requestApi().request(EDIT_ADMIN, {
      method: "POST",
      data: values,
    });

    console.log({ data });

    if (data.status) {
      // console.log("success-----------")
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

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_ADMIN_REQUEST_SUCCESS,
          payload: data.data.admin,
        });
      }, 300);
    } else {
      toast.warn(data.message, {
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
        type: actionType.EDIT_ADMIN_REQUEST_FAIL,
        paylaod: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_ADMIN_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};

// SET STATUS FALSE

export const setStatusFalse = () => (dispatch) => {
  dispatch({
    type: actionType.SET_STATUS_FALSE,
  });
};
