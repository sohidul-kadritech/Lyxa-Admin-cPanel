import { toast } from "react-toastify";
import { successMsg } from "../../helpers/successMsg";
import {
  ALL_TRX,
  DELIVERY_TRX,
  DROP_TRX,
  GET_DELIVERY_FEE,
  RIDER_MAKE_PAYMENT,
  RIDER_RECEIVED_PAYMENT,
  SELLERS_TRX,
  SELLER_TRX,
  SET_DELIVERY_FEE,
  SHOP_ADD_REMOVE_CREDIT,
  SHOP_ADJUST_CASH,
  SHOP_MAKE_PAYMENT,
  SHOP_TRX,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionTypes from "../actionType";

// GET SELLERS TRX

export const getSellersTrx =
  (refresh = false, page) =>
    async (dispatch, getState) => {
      const { sellerTrxEndDate, sellerTrxStartDate, sellersTrxs, sellerSearchKey } =
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
              searchKey: sellerSearchKey
            },
          });



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

      const { sellerTrxs, shopsTrxStartDate, shopsTrxEndDate } = getState().appWalletReducer;

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
              startDate: shopsTrxStartDate,
              endDate: shopsTrxEndDate,
            },
          });



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


      const { shopTrxs, shopSearchKey, shopTrxStartDate, shopTrxEndDate, shopTrxType: { value }, shopTrxOrderBy: { value: orderBy }, shopTrxAmountRange, shopTrxAmountRangeType: { value: rangeType }, shopTrxBy } = getState().appWalletReducer;

      if (shopTrxs.length < 1 || refresh) {
        try {
          dispatch({
            type: actionTypes.GET_SHOP_TRX_REQUEST_SEND,
          });

          const { data } = await requestApi().request(SHOP_TRX, {
            method: 'POST',
            data: {
              page,
              pageSize: 50,
              shopId: shopId.toString(),
              sortBy: "desc",
              tnxFilter: {
                startDate: shopTrxStartDate,
                endDate: shopTrxEndDate,
                type: !value ? ['adminAddBalanceShop', "adminRemoveBalanceShop", "adminSettlebalanceShop"] : [value],
                searchKey: shopSearchKey,
                amountBy: orderBy,
                amountRange: shopTrxAmountRange,
                amountRangeType: rangeType,
                adminBy: shopTrxBy?._id
              }
            },
          });



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

// SHOP MAKE PAYMENT

export const shopMakePayment = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionTypes.SHOP_MAKE_PAYMENT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SHOP_MAKE_PAYMENT, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionTypes.SHOP_MAKE_PAYMENT_REQUEST_SUCCESS,
        payload: data.data.transactionShop,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionTypes.SHOP_MAKE_PAYMENT_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.SHOP_MAKE_PAYMENT_REQUEST_FAIL,
      payload: error.message,
    });
    toast.error(error.message);
  }
};

// SHOP ADD / REMOVE CREDIT

export const shopAddRemoveCredit = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionTypes.SHOP_CREDIT_UPDATE_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SHOP_ADD_REMOVE_CREDIT, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionTypes.SHOP_CREDIT_UPDATE_REQUEST_SUCCESS,
        payload: data.data.transactionShop,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionTypes.SHOP_CREDIT_UPDATE_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.SHOP_CREDIT_UPDATE_REQUEST_FAIL,
      payload: error.message,
    });
    toast.error(error.message);
  }
};

// SHOP ADJUST CASH

export const adjustShopCash = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.SHOP_ADJUST_CASH_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SHOP_ADJUST_CASH, {
      method: "POST",
      data: {
        shopId,
      },
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionTypes.SHOP_ADJUST_CASH_REQUEST_SUCCESS,
        payload: data.data.transactionShop,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionTypes.SHOP_ADJUST_CASH_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.SHOP_ADJUST_CASH_REQUEST_FAIL,
      payload: error.message,
    });
    toast.error(error.message);
  }
};

// RIDER MAKE PAYMENT

export const riderMakePayment = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionTypes.RIDER_MAKE_PAYMENT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(RIDER_MAKE_PAYMENT, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionTypes.RIDER_MAKE_PAYMENT_REQUEST_SUCCESS,
        payload: data.data.transactionShop,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionTypes.RIDER_MAKE_PAYMENT_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.RIDER_MAKE_PAYMENT_REQUEST_FAIL,
      payload: error.message,
    });
    toast.error(error.message);
  }
};

// RIDER RECEIVED PAYMENT

export const riderReceivedPayment = (values) => async (dispatch) => {

  try {
    dispatch({
      type: actionTypes.RIDER_RECEIVED_PAYMENT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(RIDER_RECEIVED_PAYMENT, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionTypes.RIDER_RECEIVED_PAYMENT_REQUEST_SUCCESS,
        payload: data.data.transactionShop,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionTypes.RIDER_RECEIVED_PAYMENT_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.RIDER_RECEIVED_PAYMENT_REQUEST_FAIL,
      payload: error.message,
    });
    successMsg.error(error.message, "error");
  }
};

// SELLER TRX START DATE AND END DATE

export const updateSellerTrxStartDate = (startDate) => (dispatch) => {

  dispatch({
    type: actionTypes.SELLER_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateSellerTrxEndDate = (date) => (dispatch) => {
  dispatch({
    type: actionTypes.SELLER_TRX_END_DATE,
    payload: date,
  });
};


export const updateSellerWalletSearchKey = (searchKey) => (dispatch) => {

  dispatch({
    type: actionTypes.SELLER_WALLET_SEARCH_KEY,
    payload: searchKey,
  });
};

// DELIVERY TRX START AND END DATE

export const updateDeliveryTrxStartDate = (startDate) => (dispatch) => {

  dispatch({
    type: actionTypes.DELIVERY_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateDeliveryTrxEndDate = (date) => (dispatch) => {

  dispatch({
    type: actionTypes.DELIVERY_TRX_END_DATE,
    payload: date,
  });
};





// GET DELIVERY TRX

export const getDeliveryTrx =
  (refresh = false, page) =>
    async (dispatch, getState) => {
      const { deliverySortByKey, deliverySearchKey, deliveryTrxs, deliveryTrxStartDate, deliveryTrxEndDate } =
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
              startDate: deliveryTrxStartDate,
              endDate: deliveryTrxEndDate
            },
          });



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

  dispatch({
    type: actionTypes.DROP_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateDropTrxEndDate = (date) => (dispatch) => {

  dispatch({
    type: actionTypes.DROP_TRX_END_DATE,
    payload: date,
  });
};

// SINGLE RIDER TRX DATE

export const updateRiderTrxStartDate = (startDate) => (dispatch) => {

  dispatch({
    type: actionTypes.RIDER_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateRiderTrxEndDate = (date) => (dispatch) => {

  dispatch({
    type: actionTypes.RIDER_TRX_END_DATE,
    payload: date,
  });
};

export const updateRiderCashTrxStartDate = (startDate) => (dispatch) => {

  dispatch({
    type: actionTypes.RIDER_CASH_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateRiderCashTrxEndDate = (date) => (dispatch) => {

  dispatch({
    type: actionTypes.RIDER_CASH_TRX_END_DATE,
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

export const updateRidersTrxStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: actionTypes.RIDERS_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateRidersTrxEndDate = (date) => (dispatch) => {

  dispatch({
    type: actionTypes.RIDERS_TRX_END_DATE,
    payload: date,
  });
};

export const updateShopsTrxStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOPS_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateShopsTrxEndDate = (date) => (dispatch) => {

  dispatch({
    type: actionTypes.SHOPS_TRX_END_DATE,
    payload: date,
  });
};

export const updateShopTrxStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOP_TRX_START_DATE,
    payload: startDate,
  });
};

export const updateShopTrxEndDate = (date) => (dispatch) => {

  dispatch({
    type: actionTypes.SHOP_TRX_END_DATE,
    payload: date,
  });
};

export const updateShopSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOP_WALLET_SEARCH_KEY,
    payload: value,
  });
};

export const updateShopTrxType = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOP_WALLET_TYPE,
    payload: value,
  });
};

export const updateShopOrderBy = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOP_WALLET_ORDER_BY,
    payload: value,
  });
};

export const updateShopAmountRange = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOP_WALLET_AMOUNT_RANGE,
    payload: parseInt(value),
  });
};

export const updateShopAmountRangeType = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOP_WALLET_AMOUNT_RANGE_TYPE,
    payload: value,
  });
};

export const updateShopTrxBy = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOP_WALLET_CREATED_BY,
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

          console.log({ data })


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
