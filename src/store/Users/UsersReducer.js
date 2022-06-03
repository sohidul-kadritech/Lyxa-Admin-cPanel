import * as actionType from "../actionType";
import  moment  from 'moment';

const initialState = {
  laoding: false,
  users: [],
  message: null,
  error: null,
  sortByKey: "desc",
  searchKey: "",
  statusKey: "all",
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  status: false,
  sortBy: { label: "ASC", value: "ASC" },
  startDate: moment().format('YYYY-MM-DD'),
  endDate: moment().add(1, 'M').format('YYYY-MM-DD'),
  transactionList: []
};

const usersReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // ALL USERS

    case actionType.GET_ALL_USERS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        message: null,
        errro: null,
      };

    case actionType.GET_ALL_USERS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        users: payload.users,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.GET_ALL_USERS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        message: null,
        errro: payload,
      };

      // TRANSACTIONS

    case actionType.USER_TRANSACTIONS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        errro: null,
      };

    case actionType.USER_TRANSACTIONS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        transactionList: payload.transactionList,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
      };

    case actionType.USER_TRANSACTIONS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        errro: payload,
      };

    //   UPDATE SORT BY KEY

    case actionType.UPDATE_USERS_SORT_KEY:
      return {
        ...state,
        sortByKey: payload,
      };

    //   UPDATE SEARCH KEY

    case actionType.UPDATE_USERS_SEARCH_KEY:
      return {
        ...state,
        searchKey: payload,
      };

      // UPDATE USER STATUS KEY 

      case actionType.UPDATE_STATUS_KEY:
      return {
        ...state,
        statusKey: payload,
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

      case actionType.UPDATE_SORT_BY_KEY:
        return {
          ...state,
          sortBy: payload,
        };

    default:
      return state;
  }
};

export default usersReducer;
