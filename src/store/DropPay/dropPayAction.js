import { toast } from "react-toastify";
import {
  ADD_USER_BALANCE,
  DROP_PAY_LIST,
  REMOVE_USER_BALANCE,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// GET ALL DROP PAY
export const getAllDropPay =
  (refresh = false, page = 1) =>
    async (dispatch, getState) => {
      const { sortByKey, startDate, endDate, credits, searchKey } =
        getState().dropPayReducer;

      if (credits.length < 1 || refresh) {
        try {
          dispatch({
            type: actionType.ALL_DROP_PAY_REQUEST_SEND,
          });

          const {
            data: { status, error, data = null },
          } = await requestApi().request(DROP_PAY_LIST, {
            params: {
              page: page,
              startDate,
              endDate,
              sortBy: sortByKey.value,
              pageSize: 50,
              searchKey
            },
          });



          if (status) {
            dispatch({
              type: actionType.ALL_DROP_PAY_REQUEST_SUCCESS,
              payload: data,
            });
          } else {
            dispatch({
              type: actionType.ALL_DROP_PAY_REQUEST_FAIL,
              payload: error,
            });
          }
        } catch (error) {
          dispatch({
            type: actionType.ALL_DROP_PAY_REQUEST_FAIL,
            payload: error.message,
          });
        }
      }
    };

//   ADD USER AMOUNT

export const addUserAmount = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionType.ADD_USER_AMOUNT_REQUEST_SEND,
    });

    const {
      data: { status, message, error, data = null },
    } = await requestApi().request(ADD_USER_BALANCE, {
      method: "POST",
      data: values,
    });



    if (status) {
      toast.success(message, {
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
        type: actionType.ADD_USER_AMOUNT_REQUEST_SUCCESS,
        payload: data,
      });
    } else {
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
        type: actionType.ADD_USER_AMOUNT_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_USER_AMOUNT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

//  WITHDRAW AMOUNT

export const withdrawUserAmount = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionType.REMOVE_USER_AMOUNT_REQUEST_SEND,
    });

    const {
      data: { status, message, error, data = null },
    } = await requestApi().request(REMOVE_USER_BALANCE, {
      method: "POST",
      data: values,
    });


    if (status) {
      toast.success(message, {
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
        type: actionType.REMOVE_USER_AMOUNT_REQUEST_SUCCESS,
        payload: data,
      });
    } else {
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
        type: actionType.REMOVE_USER_AMOUNT_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.REMOVE_USER_AMOUNT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const updateLyxaPaySearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_LYXA_PAY_SEARCH_KEY,
    payload: value,
  });
};

export const updateDropPaySortByKey = (type) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SORT_BY_KEY,
    payload: type,
  });
};

export const updateDropPayStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_START_DATE,
    payload: startDate,
  });
};

export const updateDropPayEndDate = (date) => (dispatch) => {

  dispatch({
    type: actionType.UPDATE_END_DATE,
    payload: date,
  });
};
