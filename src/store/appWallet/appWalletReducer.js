import moment from "moment";
import * as actionTypes from "../actionType";

const init = {
  loading: false,
  error: null,
  status: false,
  sellerTrxs: [],
  sellerTrxStartDate: moment().startOf("month").format("YYYY-MM-DD"),
  sellerTrxEndDate: moment().endOf("month").format("YYYY-MM-DD"),
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  deliveryTrxStartDate: moment().startOf("month").format("YYYY-MM-DD"),
  deliveryTrxEndDate: moment().endOf("month").format("YYYY-MM-DD"),
  deliveryTrxs: [],
  dropTrxStartDate: moment().startOf("month").format("YYYY-MM-DD"),
  dropTrxEndDate: moment().endOf("month").format("YYYY-MM-DD"),
  dropTrxs: [],
};

const appWalletReducer = (state = init, action) => {
  const { type, payload } = action;

  switch (type) {
    // SELLER TRX
    case actionTypes.SELLER_TRX_START_DATE:
      return {
        ...state,
        sellerTrxStartDate: payload,
      };

    case actionTypes.SELLER_TRX_END_DATE:
      return {
        ...state,
        sellerTrxEndDate: payload,
      };

    case actionTypes.GET_SELLER_TRX_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.GET_SELLER_TRX_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        sellerTrxs: payload.transactionList,
        Paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionTypes.GET_SELLER_TRX_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    // DELIVERY TRX

    case actionTypes.DELIVERY_TRX_START_DATE:
      return {
        ...state,
        deliveryTrxStartDate: payload,
      };

    case actionTypes.DELIVERY_TRX_END_DATE:
      return {
        ...state,
        deliveryTrxEndDate: payload,
      };

    case actionTypes.GET_DELIVERY_TRX_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.GET_DELIVERY_TRX_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        deliveryTrxs: payload.transactionList,
        Paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionTypes.GET_DELIVERY_TRX_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    // DROP TRX

    case actionTypes.DROP_TRX_START_DATE:
      return {
        ...state,
        dropTrxStartDate: payload,
      };

    case actionTypes.DROP_TRX_END_DATE:
      return {
        ...state,
        dropTrxEndDate: payload,
      };

    case actionTypes.GET_DROP_TRX_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.GET_DROP_TRX_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        dropTrxs: payload.transactionList,
        Paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionTypes.GET_DROP_TRX_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    default:
      return state;
  }
};

export default appWalletReducer;
