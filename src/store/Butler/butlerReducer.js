/* eslint-disable default-param-last */
import moment from 'moment';
import * as actionType from '../actionType';

const initialState = {
  loading: false,
  error: null,
  orders: [],
  isUpdated: false,
  isFlagged: false,
  isCanceled: false,
  status: false,
  typeKey: { label: 'All', value: 'all' },
  sortByKey: { label: 'Desc', value: 'desc' },
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().endOf('month').format('YYYY-MM-DD'),
  paginate: null,
  deliveryBoy: '',
  page: 1,
  totalPage: 1,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  orderType: { label: 'All', value: 'all' },
  orderSearchKey: '',
  activeDelieryBoys: [],
};

const butlerReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionType.ALL_BUTLER_ORDERS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionType.ALL_BUTLER_ORDERS_REQUEST_SUCCESS:
      return {
        ...state,
        totalPage: payload.paginate.metadata.page.totalPage,
        loading: false,
        orders: payload.orders,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionType.ALL_BUTLER_ORDERS_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    // UPDATE STATUS
    case actionType.UPDATE_BUTLER_ORDER_IS_UPDATED:
      return {
        ...state,
        isUpdated: payload,
      };

    case actionType.BUTLER_ORDER_UPDATE_STATUS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.BUTLER_ORDER_UPDATE_STATUS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        orders: payload,
        isUpdated: true,
      };

    case actionType.BUTLER_ORDER_UPDATE_STATUS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // SEND FLAG
    case actionType.UPDATE_BUTLER_ORDER_IS_FLAGGED:
      return {
        ...state,
        isFlagged: payload,
      };

    case actionType.SEND_BUTLER_ORDER_FLAG_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.SEND_BUTLER_ORDER_FLAG_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        isFlagged: true,
        status: true,
        orders: payload,
      };

    case actionType.SEND_BUTLER_ORDER_FLAG_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // DELETE FLAG
    case actionType.DELETE_BUTLER_ORDER_FLAG_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.DELETE_BUTLER_ORDER_FLAG_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.DELETE_BUTLER_ORDER_FLAG_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // CANCEL ORDER
    case actionType.CANCEL_BUTLER_ORDER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.CANCEL_BUTLER_ORDER_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        isCanceled: true,
        status: true,
        orders: payload,
      };

    case actionType.CANCEL_BUTLER_ORDER_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.UPDATE_BUTLER_ORDER_IS_CANCELLED:
      return {
        ...state,
        isCanceled: payload,
      };
    // FILTERS
    case actionType.UPDATE_BUTLER_ORDER_PAGE: {
      return {
        ...state,
        page: payload,
      };
    }
    case actionType.UPDATE_BUTLER_ORDER_SORT_BY_FILTER:
      return {
        ...state,
        sortByKey: payload,
      };

    case actionType.UPDATE_BUTLER_ORDER_START_DATE_FILTER:
      return {
        ...state,
        startDate: payload,
      };

    case actionType.UPDATE_BUTLER_ORDER_END_DATE_FILTER:
      return {
        ...state,
        endDate: payload,
      };

    case actionType.UPDATE_BUTLER_ORDER_TYPE_FILTER:
      return {
        ...state,
        typeKey: payload,
      };

    case actionType.UPDATE_BUTLER_ORDER_SEARCH_KEY:
      return {
        ...state,
        orderSearchKey: payload,
      };

    case actionType.UPDATE_BUTLER_ORDER_DELIVERY_BOY:
      return {
        ...state,
        deliveryBoy: payload,
      };

    case actionType.CLEAR_BUTLER_SEARCH_FILTER:
      return {
        ...state,
        sortByKey: initialState.sortByKey,
        startDate: initialState.startDate,
        endDate: initialState.endDate,
        typeKey: initialState.typeKey,
        orderSearchKey: initialState.orderSearchKey,
        deliveryBoy: initialState.deliveryBoy,
      };

    default:
      return state;
  }
};

export default butlerReducer;
