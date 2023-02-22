/* eslint-disable default-param-last */
import * as actionType from '../actionType';

const initialState = {
  loading: false,
  status: true,
  transactions: [],
  summary: {},
  error: null,
  page: 1,
  currentPage: 1,
  pageSize: 50,
  pagination: {
    paging: [],
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const vatReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.GET_ALL_VAT_INFO_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.GET_ALL_VAT_INFO_REQUEST_SUCESSS:
      return {
        ...state,
        loading: false,
        transactions: payload?.transactions,
        summary: payload?.summary,
        pagination: payload?.paginate?.metadata,
      };

    case actionType.GET_ALL_VAT_INFO_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.SETTLE_VAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.SETTLE_VAT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.SETTLE_VAT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
      };

    default:
      return state;
  }
};

export default vatReducer;
