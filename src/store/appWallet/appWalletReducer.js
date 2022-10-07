import moment from "moment";
import * as actionTypes from "../actionType";

const init = {
  loading: false,
  error: null,
  status: false,
  sellersTrxs: [],
  sellerTrxs: [],
  shopTrxs: {},
  sellerTrxStartDate: moment().startOf("month").format("YYYY-MM-DD"),
  sellerTrxEndDate: moment().endOf("month").format("YYYY-MM-DD"),
  shopsTrxStartDate: moment().startOf("month").format("YYYY-MM-DD"),
  shopsTrxEndDate: moment().endOf("month").format("YYYY-MM-DD"),
  shopTrxStartDate: moment().startOf("month").format("YYYY-MM-DD"),
  shopTrxEndDate: moment().endOf("month").format("YYYY-MM-DD"),
  sellerSearchKey: '',
  shopTrxType: { label: "Add Balance", value: "adminAddBalanceShop" },
  shopTrxOrderBy: { label: "Desc", value: "desc" },
  shopTrxAmountRange: 0,
  shopTrxAmountRangeType: '',
  shopSearchKey: '',
  shopTrxBy: '',
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
  deliverySortByKey: { label: "Desc", value: "desc" },
  deliverySearchKey: "",
  trxSortByKey: { label: "Desc", value: "desc" },
  trxSearchKey: "",
  trxAccountType: { label: "All", value: "all" },
  allTrxs: [],
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
        shopsTrxEndDate: payload,
      };

    // SHOPS TRX
    case actionTypes.SHOPS_TRX_START_DATE:
      return {
        ...state,
        shopsTrxStartDate: payload,
      };

    case actionTypes.SHOPS_TRX_END_DATE:
      return {
        ...state,
        shopsTrxEndDate: payload
      };

    case actionTypes.RIDERS_TRX_START_DATE:
      return {
        ...state,
        deliveryTrxStartDate: payload,
      };

    case actionTypes.RIDERS_TRX_END_DATE:
      return {
        ...state,
        deliveryTrxEndDate: payload
      };

    case actionTypes.SHOP_WALLET_TYPE:
      return {
        ...state,
        shopTrxType: payload
      };

    case actionTypes.SHOP_WALLET_CREATED_BY:
      return {
        ...state,
        shopTrxBy: payload
      };

    case actionTypes.SELLER_WALLET_SEARCH_KEY:
      return {
        ...state,
        sellerSearchKey: payload,
      };

    case actionTypes.SHOP_WALLET_ORDER_BY:
      return {
        ...state,
        shopTrxOrderBy: payload,
      };

    case actionTypes.SHOP_WALLET_SEARCH_KEY:
      return {
        ...state,
        shopSearchKey: payload,
      };

    case actionTypes.SHOP_WALLET_AMOUNT_RANGE:
      return {
        ...state,
        shopTrxAmountRange: payload,
      };

    case actionTypes.SHOP_WALLET_AMOUNT_RANGE_TYPE:
      return {
        ...state,
        shopTrxAmountRangeType: payload,
      };


    case actionTypes.GET_SELLERS_TRX_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.GET_SELLERS_TRX_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        sellersTrxs: payload.sellers,
        Paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionTypes.GET_SELLERS_TRX_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    case actionTypes.GET_SELLER_TRX_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionTypes.GET_SELLER_TRX_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        sellerTrxs: payload,
        // Paginate: payload.paginate,
        // paging: payload.paginate.metadata.paging,
        // hasNextPage: payload.paginate.metadata.hasNextPage,
        // currentPage: payload.paginate.metadata.page.currentPage,
        // hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionTypes.GET_SELLER_TRX_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    case actionTypes.GET_SHOP_TRX_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionTypes.GET_SHOP_TRX_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        shopTrxs: {
          trxs: payload.transections,
          shop: payload.shop,
          summary: payload.summary,
        },
        Paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
      };

    case actionTypes.GET_SHOP_TRX_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    case actionTypes.SHOP_MAKE_PAYMENT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionTypes.SHOP_MAKE_PAYMENT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        shopTrxs: {
          ...state.shopTrxs,
          trxs: [...state.shopTrxs.trxs, payload],
        },
      };

    case actionTypes.SHOP_MAKE_PAYMENT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    case actionTypes.SHOP_CREDIT_UPDATE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionTypes.SHOP_CREDIT_UPDATE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        shopTrxs: {
          ...state.shopTrxs,
          trxs: [...state.shopTrxs.trxs, payload],
        },
      };

    case actionTypes.SHOP_CREDIT_UPDATE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionTypes.SHOP_ADJUST_CASH_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionTypes.SHOP_ADJUST_CASH_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionTypes.SHOP_ADJUST_CASH_REQUEST_FAIL:
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
        status: false,
      };

    case actionTypes.GET_DELIVERY_TRX_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        deliveryTrxs: payload.deliveryBoy,
        Paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionTypes.GET_DELIVERY_TRX_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    case actionTypes.RIDER_MAKE_PAYMENT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionTypes.RIDER_MAKE_PAYMENT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionTypes.RIDER_MAKE_PAYMENT_REQUEST_FAIL:
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

    case actionTypes.UPDATE_DELIVERY_SORT_BY_KEY:
      return {
        ...state,
        deliverySortByKey: payload,
      };

    case actionTypes.UPDATE_DELIVERY_SEARCH_KEY:
      return {
        ...state,
        deliverySearchKey: payload,
      };

    case actionTypes.UPDATE_TRX_SORT_BY:
      return {
        ...state,
        trxSortByKey: payload,
      };

    case actionTypes.UPDATE_TRX_SEARCH_KEY:
      return {
        ...state,
        trxSearchKey: payload,
      };

    case actionTypes.UPDATE_TRX_ACCOUNT_TYPE:
      return {
        ...state,
        trxAccountType: payload,
      };

    case actionTypes.GET_ALL_TRX_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.GET_ALL_TRX_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        allTrxs: payload.transections,
        Paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionTypes.GET_ALL_TRX_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    case actionTypes.RIDER_RECEIVED_PAYMENT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.RIDER_RECEIVED_PAYMENT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionTypes.RIDER_RECEIVED_PAYMENT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    default:
      return state;
  }
};

export default appWalletReducer;
