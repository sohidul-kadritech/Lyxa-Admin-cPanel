import { successMsg } from '../../helpers/successMsg';
import { GET_ALL_ADMIN_VAT, GET_SINGLE_SHOP_VAT, SETTLE_ADMIN_VAT, SETTLE_SHOP_VAT } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionType from '../actionType';

export const getAllVatInfo = (reqBody, accountType, shopId) => async (dispatch, getState) => {
  const { page, pageSize } = getState().vatReducer;
  reqBody.page = page;
  reqBody.pageSize = pageSize;
  reqBody.pagingRange = 5;

  let API = GET_ALL_ADMIN_VAT;

  if (accountType !== 'admin') {
    API = GET_SINGLE_SHOP_VAT;
    reqBody.shopId = shopId;
  }

  try {
    dispatch({
      type: actionType.GET_ALL_VAT_INFO_REQUEST_SEND,
    });
    const { data } = await requestApi().request(API, {
      data: reqBody,
      method: 'POST',
    });

    // status true
    if (data?.status) {
      dispatch({
        type: actionType.GET_ALL_VAT_INFO_REQUEST_SUCESSS,
        payload: data?.data,
      });
      // status false
    } else {
      dispatch({
        type: actionType.GET_ALL_VAT_INFO_REQUEST_FAIL,
        payload: data?.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.GET_ALL_VAT_INFO_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

export const settleVat = (reqBody, accountType) => async (dispatch) => {
  let API = SETTLE_ADMIN_VAT;

  if (accountType !== 'admin') {
    API = SETTLE_SHOP_VAT;
  }

  dispatch({
    type: actionType.SETTLE_VAT_REQUEST_SEND,
  });

  try {
    const resp = await requestApi().request(API, {
      method: 'POST',
      data: reqBody,
    });

    if (resp?.data?.status) {
      dispatch({
        type: actionType.SETTLE_VAT_REQUEST_SUCCESS,
      });
    } else {
      successMsg(resp?.data?.message);
      dispatch({
        type: actionType.SETTLE_VAT_REQUEST_FAIL,
      });
    }
  } catch (error) {
    successMsg(error?.message);

    dispatch({
      type: actionType.SETTLE_VAT_REQUEST_FAIL,
    });
  }
};
