import { toast } from "react-toastify";
import { successMsg } from "../../helpers/successMsg";
import {
  DELIVERY_TRX,
  DROP_TRX,
  GET_DELIVERY_FEE,
  SELLER_TRX,
  SET_DELIVERY_FEE,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionTypes from "../actionType";

// GET SELLER TRX

export const getSellerTrx =
  (refresh = false, page) =>
  async (dispatch, getState) => {
    const { sellerTrxEndDate, sellerTrxStartDate, sellerTrxs } =
      getState().appWalletReducer;

    if (sellerTrxs.length < 1 || refresh) {
      try {
        dispatch({
          type: actionTypes.GET_SELLER_TRX_REQUEST_SEND,
        });

        const { data } = await requestApi().request(SELLER_TRX, {
          params: {
            page,
            pageSize: 50,
            startDate: sellerTrxStartDate,
            endDate: sellerTrxEndDate,
          },
        });

        console.log(data);

        if (data.status) {
          dispatch({
            type: actionTypes.GET_SELLER_TRX_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionTypes.GET_SELLER_TRX_REQUEST_FAIL,
            payload: data.error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionTypes.GET_SELLER_TRX_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// SELLER TRX START DATE AND END DATE

export const updateSellerTrxStartDate = (startDate) => (dispatch) => {
  console.log({ startDate });
  dispatch({
    type: actionTypes.SELLER_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateSellerTrxEndDate = (date) => (dispatch) => {
  // console.log({ date });
  dispatch({
    type: actionTypes.SELLER_TRX_END_DATE,
    payload: date,
  });
};

// DELIVERY TRX START AND END DATE

export const updateDeliveryTrxStartDate = (startDate) => (dispatch) => {
  console.log({ startDate });
  dispatch({
    type: actionTypes.DELIVERY_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateDeliveryTrxEndDate = (date) => (dispatch) => {
  // console.log({ date });
  dispatch({
    type: actionTypes.DELIVERY_TRX_END_DATE,
    payload: date,
  });
};

// GET DELIVERY TRX

export const getDeliveryTrx =
  (refresh = false, page) =>
  async (dispatch, getState) => {
    const { deliveryTrxEndDate, deliveryTrxStartDate, deliveryTrxs } =
      getState().appWalletReducer;

    if (deliveryTrxs.length < 1 || refresh) {
      try {
        dispatch({
          type: actionTypes.GET_DELIVERY_TRX_REQUEST_SEND,
        });

        const { data } = await requestApi().request(DELIVERY_TRX, {
          params: {
            page,
            pageSize: 50,
            startDate: deliveryTrxStartDate,
            endDate: deliveryTrxEndDate,
          },
        });

        console.log(data);

        if (data.status) {
          dispatch({
            type: actionTypes.GET_DELIVERY_TRX_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionTypes.GET_DELIVERY_TRX_REQUEST_FAIL,
            payload: data.error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionTypes.GET_DELIVERY_TRX_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// DROP TRANSACTIONS

export const updateDropTrxStartDate = (startDate) => (dispatch) => {
  console.log({ startDate });
  dispatch({
    type: actionTypes.DROP_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateDropTrxEndDate = (date) => (dispatch) => {
  // console.log({ date });
  dispatch({
    type: actionTypes.DROP_TRX_END_DATE,
    payload: date,
  });
};

// GET DELIVERY TRX

export const getDropTrx =
  (refresh = false, page) =>
  async (dispatch, getState) => {
    const { dropTrxEndDate, dropTrxStartDate, dropTrxs } =
      getState().appWalletReducer;

    if (dropTrxs.length < 1 || refresh) {
      try {
        dispatch({
          type: actionTypes.GET_DROP_TRX_REQUEST_SEND,
        });

        const { data } = await requestApi().request(DROP_TRX, {
          params: {
            page,
            pageSize: 50,
            startDate: dropTrxStartDate,
            endDate: dropTrxEndDate,
          },
        });

        console.log(data);

        if (data.status) {
          dispatch({
            type: actionTypes.GET_DROP_TRX_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionTypes.GET_DROP_TRX_REQUEST_FAIL,
            payload: data.error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionTypes.GET_DROP_TRX_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };
