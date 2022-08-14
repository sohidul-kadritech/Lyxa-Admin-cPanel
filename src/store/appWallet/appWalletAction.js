import { toast } from "react-toastify";
import { successMsg } from "../../helpers/successMsg";
import {
  ALL_TRX,
  DELIVERY_TRX,
  DROP_TRX,
  GET_DELIVERY_FEE,
  SELLERS_TRX,
  SELLER_TRX,
  SET_DELIVERY_FEE,
  SHOP_TRX,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionTypes from "../actionType";

// GET SELLERS TRX

export const getSellersTrx =
  (refresh = false, page) =>
  async (dispatch, getState) => {
    const { sellerTrxEndDate, sellerTrxStartDate, sellersTrxs } =
      getState().appWalletReducer;

    if (sellersTrxs.length < 1 || refresh) {
      try {
        dispatch({
          type: actionTypes.GET_SELLERS_TRX_REQUEST_SEND,
        });

        const { data } = await requestApi().request(SELLERS_TRX, {
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
            type: actionTypes.GET_SELLERS_TRX_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionTypes.GET_SELLERS_TRX_REQUEST_FAIL,
            payload: data.error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionTypes.GET_SELLERS_TRX_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// GET SINGLE SELLER TRX

export const getSellerTrx =
  (refresh = false, sellerId, page) =>
  async (dispatch, getState) => {
    console.log({ sellerId });
    const { sellerTrxs } = getState().appWalletReducer;

    if (sellerTrxs.length < 1 || refresh) {
      try {
        dispatch({
          type: actionTypes.GET_SELLER_TRX_REQUEST_SEND,
        });

        const { data } = await requestApi().request(SELLER_TRX, {
          params: {
            page,
            pageSize: 50,
            sellerId,
          },
        });

        console.log("seller trx", data);

        if (data.status) {
          const { shops } = data.data;
          dispatch({
            type: actionTypes.GET_SELLER_TRX_REQUEST_SUCCESS,
            payload: shops,
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

// GET SINGLE SHOP TRX

export const getShopTrxs =
  (refresh = false, shopId, page) =>
  async (dispatch, getState) => {
    const { shopTrxs } = getState().appWalletReducer;

    if (shopTrxs.length < 1 || refresh) {
      try {
        dispatch({
          type: actionTypes.GET_SHOP_TRX_REQUEST_SEND,
        });

        const { data } = await requestApi().request(SHOP_TRX, {
          params: {
            page,
            pageSize: 50,
            shopId,
          },
        });

        console.log("shop trx", data);

        if (data.status) {
          dispatch({
            type: actionTypes.GET_SHOP_TRX_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionTypes.GET_SHOP_TRX_REQUEST_FAIL,
            payload: data.error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionTypes.GET_SHOP_TRX_REQUEST_FAIL,
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
    const { deliverySortByKey, deliverySearchKey, deliveryTrxs } =
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
            sortBy: deliverySortByKey.value,
            searchKey: deliverySearchKey,
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

// DELIVERY BOY SORT BY KEY

export const updateDeliverySortByKey = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_DELIVERY_SORT_BY_KEY,
    payload: value,
  });
};

export const updateDeliverySearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_DELIVERY_SEARCH_KEY,
    payload: value,
  });
};

// GET USER/DELIVERY/SELLER/SHOP/ADMIN TRX

export const getAllTransctions =
  (refresh = false, page) =>
  async (dispatch, getState) => {
    const { trxSortByKey, trxSearchKey, trxAccountType, allTrxs } =
      getState().appWalletReducer;

    if (allTrxs.length < 1 || refresh) {
      try {
        dispatch({
          type: actionTypes.GET_ALL_TRX_REQUEST_SEND,
        });

        const { data } = await requestApi().request(ALL_TRX, {
          params: {
            page,
            pageSize: 50,
            sortBy: trxSortByKey.value,
            searchKey: trxSearchKey,
            account: trxAccountType.value,
          },
        });

        console.log(data);

        if (data.status) {
          dispatch({
            type: actionTypes.GET_ALL_TRX_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionTypes.GET_ALL_TRX_REQUEST_FAIL,
            payload: data.error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionTypes.GET_ALL_TRX_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// ALL TRANSACTIONS FILTER KEY

export const updateAllTrxSortByKey = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_TRX_SORT_BY,
    payload: value,
  });
};

export const updateAllTrxSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_TRX_SEARCH_KEY,
    payload: value,
  });
};

export const updateAllTrxAccountType = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_TRX_ACCOUNT_TYPE,
    payload: value,
  });
};
