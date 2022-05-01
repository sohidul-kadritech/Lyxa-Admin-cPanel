import * as actionType from "../actionType";

const initialState = {
  loading: false,
  sellers: [],
  error: null,
  status: false,
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  sortByKey: { label: "Desc", value: "desc" },
  searchKey: "",
  statusKey: { label: "All", value: "all" },
  typeKey: { label: "All", value: "all" },
  subTypeKey: { label: "All", value: "all" },
};

const sellerReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    //   ADD
    case actionType.ADD_SELLER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };
    case actionType.ADD_SELLER_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        sellers: [...state.sellers, payload],
        error: null,
      };

    case actionType.ADD_SELLER_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // GET ALL

    case actionType.GET_ALL_SELLER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.GET_ALL_SELLER_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        sellers: payload.sellers,
        error: null,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.GET_ALL_SELLER_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        status: false,
        loading: false,
      };

    // EDIT

    case actionType.EDIT_SELLER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.EDIT_SELLER_REQUEST_SUCCESS:
      const updateData = state.sellers.map((item) =>
        item._id == payload._id ? payload : item
      );

      return {
        ...state,
        loading: false,
        status: true,
        sellers: updateData,
        error: null,
      };
    case actionType.EDIT_SELLER_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    //   DELETE

    case actionType.DELETE_SELLER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.DELETE_SELLER_REQUEST_SUCCESS:
      const filered = state.sellers.filter((item) => item._id != payload._id);

      return {
        ...state,
        loading: false,
        status: true,
        sellers: filered,
        error: null,
      };
    case actionType.DELETE_SELLER_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    case actionType.SET_STATUS_FALSE:
      return {
        ...state,
        status: false,
      };

    // FILTER OPTIONS

    case actionType.UPDATE_SORT_BY_KEY:
      return {
        ...state,
        sortByKey: payload,
      };

    case actionType.UPDATE_TYPE_KEY:
      return {
        ...state,
        typeKey: payload,
      };

    case actionType.UPDATE_STATUS_KEY:
      return {
        ...state,
        statusKey: payload,
      };

    case actionType.UPDATE_SELLER_SUB_TYPE:
      return {
        ...state,
        subTypeKey: payload,
      };

    case actionType.UPDATE_SEARCH_KEY:
      return {
        ...state,
        searchKey: payload,
      };

    default:
      return state;
  }
};

export default sellerReducer;
