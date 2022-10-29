import * as actionType from "../actionType";

const initialState = {
  loading: false,
  products: [],
  status: false,
  error: null,
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  searchKey: "",
  statusKey: { label: "All", value: "all" },
  typeKey: { label: "All", value: "all" },
  sortByKey: { label: "Desc", value: "desc" },
  category: null
};

const productReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.ADD_PRODUCT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ADD_PRODUCT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        products: [...state.products, payload],
      };

    case actionType.ADD_PRODUCT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //   GET ALL PRODUCTS

    case actionType.GET_ALL_PRODUCT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.GET_ALL_PRODUCT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        products: payload.products,
        error: null,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.GET_ALL_PRODUCT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        status: false,
        loading: false,
      };

    // EDIT

    case actionType.EDIT_PRODUCT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.EDIT_PRODUCT_REQUEST_SUCCESS:
      const updateData = state.products.map((item) =>
        item._id == payload._id ? payload : item
      );

      return {
        ...state,
        loading: false,
        status: true,
        products: updateData,
        error: null,
      };
    case actionType.EDIT_PRODUCT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // STATUS UPDATE

    case actionType.UPDATE_PRODUCT_STATUS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.UPDATE_PRODUCT_STATUS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };
    case actionType.UPDATE_PRODUCT_STATUS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // ADD PRODUCT DEAL

    case actionType.ADD_PRODUCT_DEAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.ADD_PRODUCT_DEAL_REQUEST_SUCCESS:
      const filterd = state.products.map((item) =>
        item._id === payload._id ? payload : item
      );

      return {
        ...state,
        loading: false,
        status: true,
        products: filterd,
        error: null,
      };
    case actionType.ADD_PRODUCT_DEAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // DELETE SHOP DEAL

    case actionType.DELETE_PRODUCT_DEAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.DELETE_PRODUCT_DEAL_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        shops: state.products.filter((item) => item._id !== payload._id),
        error: null,
      };
    case actionType.DELETE_PRODUCT_DEAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    case actionType.UPDATE_PRODUCT_CATEGORY:
      return {
        ...state,
        category: payload,
      };


    case actionType.UPDATE_PRODUCT_SEARCH_KEY:
      return {
        ...state,
        searchKey: payload,
      };

    case actionType.UPDATE_PRODUCT_STATUS_KEY:
      return {
        ...state,
        statusKey: payload,
      };

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

    default:
      return state;
  }
};

export default productReducer;
