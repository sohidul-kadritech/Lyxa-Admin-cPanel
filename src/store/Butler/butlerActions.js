/* eslint-disable default-param-last */
import { successMsg } from '../../helpers/successMsg';
import { BUTLER_ORDER_ADD_FLAG, BUTLER_ORDER_LIST, BUTLER_ORDER_UPDATE_STATUS } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionType from '../actionType';

// GET ALL ORDER
export const getAllOrder =
  (refresh = false) =>
  async (dispatch, getState) => {
    const store = getState();
    const { orders, typeKey, startDate, endDate, sortByKey, orderSearchKey, orderType, page } = store.butlerReducer;

    if (orders.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.ALL_BUTLER_ORDERS_REQUEST_SEND,
        });
        const {
          data: { status, error, data = null },
        } = await requestApi().request(BUTLER_ORDER_LIST, {
          params: {
            page,
            pageSize: 50,
            startDate,
            endDate,
            orderType: orderType.value,
            sortBy: sortByKey.value,
            type: typeKey.value,
            searchKey: orderSearchKey,
          },
        });
        if (status) {
          dispatch({
            type: actionType.ALL_BUTLER_ORDERS_REQUEST_SUCCESS,
            payload: data,
          });
        } else {
          dispatch({
            type: actionType.ALL_BUTLER_ORDERS_REQUEST_FAIL,
            payload: error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.ALL_BUTLER_ORDERS_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// ORDER UPDATE STATUS

export const updateButlerOrderStatus = (values) => async (dispatch, getState) => {
  const store = getState();
  const { orders: oldList } = store.butlerReducer;

  try {
    dispatch({
      type: actionType.BUTLER_ORDER_UPDATE_STATUS_REQUEST_SEND,
    });

    const { data } = await requestApi().request(BUTLER_ORDER_UPDATE_STATUS, {
      method: 'POST',
      data: values,
    });

    if (data.status) {
      successMsg(data.message, 'success');
      const updatedOrder = oldList.find((item) => item?._id === values.orderId);

      dispatch({
        type: actionType.BUTLER_ORDER_UPDATE_STATUS_REQUEST_SUCCESS,
        payload: [
          ...oldList.filter((item) => item?._id !== values?.orderId),
          { ...updatedOrder, orderStatus: values.orderStatus },
        ],
      });
    } else {
      successMsg(data.error, 'error');
      dispatch({
        type: actionType.BUTLER_ORDER_UPDATE_STATUS_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.BUTLER_ORDER_UPDATE_STATUS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const updateButlerOrderIsUpdated = (status) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_BUTLER_ORDER_IS_UPDATED,
    payload: status,
  });
};

// // ORDER FLAG

export const sentOrderFlag = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.SEND_ORDER_FLAG_REQUEST_SEND,
    });

    const { data } = await requestApi().request(BUTLER_ORDER_ADD_FLAG, {
      method: 'POST',
      data: values,
    });

    if (data.status) {
      successMsg(data.message, 'success');
      dispatch({
        type: actionType.SEND_ORDER_FLAG_REQUEST_SUCCESS,
        payload: data,
      });
    } else {
      successMsg(data.error, 'error');
      dispatch({
        type: actionType.SEND_ORDER_FLAG_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.SEND_ORDER_FLAG_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// // DELETE ORDER FLAG

// export const DeleteOrderFlag = (id) => async (dispatch) => {
//   try {
//     dispatch({
//       type: actionType.DELETE_ORDER_FLAG_REQUEST_SEND,
//     });

//     const { data } = await requestApi().request(DELETE_ORDER_FLAG, {
//       method: 'POST',
//       data: {
//         id,
//       },
//     });

//     if (data.status) {
//       successMsg(data.message, 'success');
//       dispatch({
//         type: actionType.DELETE_ORDER_FLAG_REQUEST_SUCCESS,
//         payload: data,
//       });
//     } else {
//       successMsg(data.error, 'error');
//       dispatch({
//         type: actionType.DELETE_ORDER_FLAG_REQUEST_FAIL,
//         payload: data.error,
//       });
//     }
//   } catch (error) {
//     dispatch({
//       type: actionType.DELETE_ORDER_FLAG_REQUEST_FAIL,
//       payload: error.message,
//     });
//   }
// };

// // CANCEL ORDER

// export const cancelOrderByAdmin = (values) => async (dispatch, getState) => {
//   const { socket } = getState().socketReducer;
//   try {
//     dispatch({
//       type: actionType.CANCEL_ORDER_REQUEST_SEND,
//     });

//     const { data } = await requestApi().request(CANCEL_ORDER, {
//       method: 'POST',
//       data: values,
//     });

//     if (data.success) {
//       successMsg(data.message, 'success');
//       dispatch({
//         type: actionType.CANCEL_ORDER_REQUEST_SUCCESS,
//         payload: data,
//       });
//       socket.emit('cancelOrder', { orderId: values?.orderId });
//     } else {
//       successMsg(data.error, 'error');
//       dispatch({
//         type: actionType.CANCEL_ORDER_REQUEST_FAIL,
//         payload: data.error,
//       });
//     }
//   } catch (error) {
//     dispatch({
//       type: actionType.CANCEL_ORDER_REQUEST_FAIL,
//       payload: error.message,
//     });
//   }
// };

// // FITLERS

export const updateButlerOrderPage = (page) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_BUTLER_ORDER_PAGE,
    payload: page,
  });
};

export const updateButlerOrderSortByKey = (type) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_BUTLER_ORDER_SORT_BY_FILTER,
    payload: type,
  });
};

export const updateButlerOrderStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_BUTLER_ORDER_START_DATE_FILTER,
    payload: startDate,
  });
};

export const updateButlerOrderEndDate = (date) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_BUTLER_ORDER_END_DATE_FILTER,
    payload: date,
  });
};

export const updateButlerOrderType = (data) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_BUTLER_ORDER_TYPE_FILTER,
    payload: data,
  });
};

export const updateButlerOrderSearchKey = (search) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_BUTLER_ORDER_SEARCH_KEY,
    payload: search,
  });
};

export const updateBulterOrderDeliveryBoy = (deliveryBoyId) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_BUTLER_ORDER_DELIVERY_BOY,
    payload: deliveryBoyId,
  });
};

export const clearButlerSearchFilter = () => (dispatch) => {
  dispatch({
    type: actionType.CLEAR_BUTLER_SEARCH_FILTER,
  });
};

// GET ACTIVE DELIVERY BOY
// export const getAllActiveDeliveryMan = (orderId) => async (dispatch) => {
//   try {
//     dispatch({
//       type: actionType.ACTIVE_DELIVERY_MANS_REQUEST_SEND,
//     });

//     const {
//       data: { status, error, data = null },
//     } = await requestApi().request(ACTIVE_DEIVERY_BOYS, {
//       params: {
//         orderId,
//       },
//     });

//     console.log('delivery boys', data);

//     if (status) {
//       dispatch({
//         type: actionType.ACTIVE_DELIVERY_MANS_REQUEST_SUCCESS,
//         payload: data?.nearByDeliveryBoys,
//       });
//     } else {
//       dispatch({
//         type: actionType.ACTIVE_DELIVERY_MANS_REQUEST_FAIL,
//         payload: error,
//       });
//     }
//   } catch (error) {
//     dispatch({
//       type: actionType.ACTIVE_DELIVERY_MANS_REQUEST_FAIL,
//       payload: error.message,
//     });
//   }
// };
