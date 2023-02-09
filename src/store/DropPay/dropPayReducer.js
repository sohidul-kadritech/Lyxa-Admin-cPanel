/* eslint-disable default-param-last */
import moment from 'moment';
import * as actionType from '../actionType';

const initialState = {
  loading: false,
  error: null,
  credits: [],
  status: false,
  sortByKey: { label: 'DESC', value: 'desc' },
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().endOf('month').format('YYYY-MM-DD'),
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  searchKey: '',
};

const dropPayReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.ALL_DROP_PAY_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionType.ALL_DROP_PAY_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        credits: payload.transactionList,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.ALL_DROP_PAY_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //   ADD AMOUNT
    case actionType.ADD_USER_AMOUNT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.ADD_USER_AMOUNT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.ADD_USER_AMOUNT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // REMOVE AMOUNT
    case actionType.REMOVE_USER_AMOUNT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.REMOVE_USER_AMOUNT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.REMOVE_USER_AMOUNT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.UPDATE_SORT_BY_KEY:
      return {
        ...state,
        sortByKey: payload,
      };

    case actionType.UPDATE_START_DATE:
      return {
        ...state,
        startDate: payload,
      };

    case actionType.UPDATE_END_DATE:
      return {
        ...state,
        endDate: payload,
      };

    case actionType.UPDATE_LYXA_PAY_SEARCH_KEY:
      return {
        ...state,
        searchKey: payload,
      };

    default:
      return state;
  }
};

export default dropPayReducer;
