import { toast } from "react-toastify";
import {
  ADD_DELIVERY_MAN,
  ALL_DELIVERY_MAN,
  EDIT_DELIVERY_MAN,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// ADD
export const addDeliveryMan = (values) => async (dispatch) => {
  console.log({ values });
  try {
    dispatch({
      type: actionType.ADD_DELIVERY_MAN_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data = null },
    } = await requestApi().request(ADD_DELIVERY_MAN, {
      method: "POST",
      data: values,
    });

    if (status) {
      console.log({ data });
      toast.warn(message, {
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
        type: actionType.ADD_DELIVERY_MAN_REQUEST_SUCCESS,
        payload: data.deliveryBoyFinal,
      });
    } else {
      toast.warn(error, {
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
        type: actionType.ADD_DELIVERY_MAN_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_DELIVERY_MAN_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL

export const allDeliveryMan =
  (refresh, page = 1) =>
  async (dispatch, getState) => {
    const { deliveryMans, sortByKey, statusKey, searchKey } =
      getState().deliveryManReducer;

    if (refresh || deliveryMans.length < 1) {
      try {
        dispatch({
          type: actionType.ALL_DELIVERY_MAN_REQUEST_SEND,
        });

        const {
          data: { status, error, data = null },
        } = await requestApi().request(ALL_DELIVERY_MAN, {
          params: {
            page,
            pageSize: 50,
            searchKey,
            sortBy: sortByKey.value,
            status: statusKey.value,
          },
        });

        if (status) {
          //   console.log({ data });
          dispatch({
            type: actionType.ALL_DELIVERY_MAN_REQUEST_SUCCESS,
            payload: data,
          });
        } else {
          dispatch({
            type: actionType.ALL_DELIVERY_MAN_REQUEST_FAIL,
            payload: error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.ALL_DELIVERY_MAN_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

//   EDIT

export const editDeliveryMan = (values) => async (dispatch) => {
  // console.log({ values });
  try {
    dispatch({
      type: actionType.EDIT_DELIVERY_MAN_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data = null },
    } = await requestApi().request(EDIT_DELIVERY_MAN, {
      method: "POST",
      data: values,
    });

    if (status) {
      // console.log({ data });
      toast.warn(message, {
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
          type: actionType.EDIT_DELIVERY_MAN_REQUEST_SUCCESS,
          payload: data.delivery,
        });
      }, [450]);
    } else {
      toast.warn(error, {
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
        type: actionType.EDIT_DELIVERY_MAN_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_DELIVERY_MAN_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

//   SORT BY KEY

export const updateDeliveryManSortByKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SORT_BY_KEY,
    payload: value,
  });
};

// UPDATE SELLER STATUS

export const updateDeliveryManStatusKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_STATUS_KEY,
    payload: value,
  });
};

// UPDATE SEARCH KEY

export const updateDeliveryManSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SEARCH_KEY,
    payload: value,
  });
};
