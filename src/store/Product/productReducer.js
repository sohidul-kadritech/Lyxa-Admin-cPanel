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
  productVisibilityKey: { label: "Yes", value: true },

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

        // DELETE

        case actionType.DELETE_PRODUCT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.DELETE_PRODUCT_REQUEST_SUCCESS:
      const filered = state.products.filter((item) =>
        item._id != payload._id 
      );

      return {
        ...state,
        loading: false,
        status: true,
        products: filered,
        error: null,
      };
    case actionType.DELETE_PRODUCT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
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

      case actionType.UPDATE_SEARCH_KEY:
        return{
            ...state,
            searchKey: payload
        }

        case actionType.UPDATE_STATUS_KEY:
        return{
            ...state,
            statusKey: payload
        }

        case actionType.UPDATE_SORT_BY_KEY:
        return{
            ...state,
            sortByKey: payload
        }

        case actionType.UPDATE_PRODUCT_VISIBILITY_KEY:
        return{
            ...state,
            productVisibilityKey: payload
        }

        case actionType.UPDATE_TYPE_KEY:
        return{
            ...state,
            typeKey: payload
        }

    default:
      return state;
  }
};

export default productReducer;
