import moment from "moment";
import * as actionType from "../actionType";

const initialState = {
  loading: false,
  error: null,
  orders: [],
  status: false,
  typeKey: { label: "All", value: "all" },
  sortByKey: { label: "Desc", value: "desc" },
  startDate: moment().startOf("month").format("YYYY-MM-DD"),
  endDate: moment().endOf("month").format("YYYY-MM-DD"),
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  orderType: { label: "All", value: "all" },
  orderSearchKey: "",
};

const orderReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionType.ALL_ORDERS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionType.ALL_ORDERS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: payload.orders,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionType.ALL_ORDERS_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    // UPDATE STATUS

    case actionType.ORDER_UPDATE_STATUS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ORDER_UPDATE_STATUS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.ORDER_UPDATE_STATUS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // SEND FLAG

    case actionType.SEND_ORDER_FLAG_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.SEND_ORDER_FLAG_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.SEND_ORDER_FLAG_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // DELETE FLAG

    case actionType.DELETE_ORDER_FLAG_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.DELETE_ORDER_FLAG_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.DELETE_ORDER_FLAG_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // CANCEL ORDER

    case actionType.CANCEL_ORDER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.CANCEL_ORDER_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.CANCEL_ORDER_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // FILTERS
    case actionType.UPDATE_ORDER_SORT_BY_FILTER:
      return {
        ...state,
        sortByKey: payload,
      };
    case actionType.UPDATE_ORDER_START_DATE_FILTER:
      return {
        ...state,
        startDate: payload,
      };
    case actionType.UPDATE_ORDER_END_DATE_FILTER:
      return {
        ...state,
        endDate: payload,
      };

    case actionType.UPDATE_ORDER_TYPE_FILTER:
      return {
        ...state,
        typeKey: payload,
      };

    case actionType.UPDATE_ORDER_BY_SHOP_TYPE:
      return {
        ...state,
        orderType: payload,
      };

    case actionType.UPDATE_ORDER_SEARCH_KEY:
      return {
        ...state,
        orderSearchKey: payload,
      };

    default:
      return state;
  }
};

export default orderReducer;
