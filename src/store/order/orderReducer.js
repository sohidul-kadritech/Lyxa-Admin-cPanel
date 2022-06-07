import moment from "moment";
import * as actionType from "../actionType";

const initialState = {
  loading: false,
  error: null,
  orders: [],
  status: false,
  typeKey: { label: "All", value: "all" },
  sortByKey: { label: "Desc", value: "desc" },
  startDate: moment().format("YYYY-MM-DD"),
  endDate: moment().add(1, "M").format("YYYY-MM-DD"),
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
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
        status: true
      };


    // FILTERS
    case actionType.ALL_ORDERS_REQUEST_FAIL:
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

    default:
      return state;
  }
};

export default orderReducer;
