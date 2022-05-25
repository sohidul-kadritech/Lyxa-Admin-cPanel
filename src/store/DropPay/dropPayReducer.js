import * as actionType from "../actionType";
import moment from "moment";

const initialState = {
  loading: false,
  error: null,
  transactions: [],
  status: false,
  sortByKey: { label: "ASC", value: "asc" },
  startDate: moment().format("YYYY-MM-DD"),
  endDate: moment().add(1, "M").format("YYYY-MM-DD"),
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
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
        transactions: payload.transactionList,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false
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
        status: false
      };

      case actionType.ADD_USER_AMOUNT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true
      };

      case actionType.ADD_USER_AMOUNT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
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

    default:
      return state;
  }
};

export default dropPayReducer;
