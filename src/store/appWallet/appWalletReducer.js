import moment from "moment";
import * as actionTypes from "../actionType";

const init = {
  loading: false,
  error: null,
  status: false,
  deliveryFee: null,
  sellerTrxs: [
    {
      _id: "62a8c6f172edafc6e13188f5",

      shop: {
        seller: {
          name: "seller name",
          profile_photo: "url",
          _id: "626b7b182a152dec55900b3f"
        },
        shopName: "shopName",
        shopLogo: "logo url",
        _id: "627e697325b67e6b397c6c27"
      },
      amount: 1800,
      status: "success",
      adminNote: "Shop Order Completed",
      isRefund: false,
      createdAt: "2022-06-14T17:35:45.777Z",
      updatedAt: "2022-06-14T17:35:45.777Z",
      __v: 0,
    },
  ],
  sellerTrxStartDate: moment().startOf('month').format('YYYY-MM-DD'),
  sellerTrxEndDate: moment().endOf('month').format('YYYY-MM-DD'),
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  deliveryTrxStartDate: moment().startOf('month').format('YYYY-MM-DD'),
  deliveryTrxEndDate: moment().endOf('month').format('YYYY-MM-DD'),
  deliveryTrxs: [
    {
      _id: "62a8d237be31b986bbf6bc6d",
      deliveryBoy: {
        name: "mizan",
        _id: "628280060f89c854b2b78ecd",
      },
      
        amount: 12,
        status: "success",
        adminNote: "Delivery Boy will get charge",
        userNote: "Amount get for Order Completed",
        isRefund: false,
      
    },
    
  ],
  dropTrxStartDate: moment().startOf('month').format('YYYY-MM-DD'),
  dropTrxEndDate: moment().endOf('month').format('YYYY-MM-DD'),
  dropTrxs: [
    {
      deliveryBoy: {
        name: "mizan",
      },
      
        amount: 12,
        status: "success",
        adminNote: "Delivery Boy will get charge",
        userNote: "Amount get for Order Completed",
        isRefund: false,
      
    },
    
  ]
};

const appWalletReducer = (state = init, action) => {
  const { type, payload } = action;

  switch (type) {
    //   ADD DELIVERY FEE
    case actionTypes.ADD_DELIVERY_FEE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_DELIVERY_FEE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };
    case actionTypes.ADD_DELIVERY_FEE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    //   GET DELIVERY FEE
    case actionTypes.GET_DELIVERY_FEE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_DELIVERY_FEE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: false,
        deliveryFee: payload,
      };
    case actionTypes.GET_DELIVERY_FEE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

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
        // sellerTrxs: payload.transactionList,
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
        // sellerTrxs: payload.transactionList,
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
        // sellerTrxs: payload.transactionList,
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
