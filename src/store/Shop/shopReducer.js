import * as actionType from "../actionType";

const initialState = {
  loading: false,
  shops: [],
  error: null,
  status: false,
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  searchKey: "",
  statusKey: { label: "All", value: "all" },
  typeKey: { label: "All", value: "all" },
  sortByKey: { label: "Desc", value: "desc" },
};

const shopReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.ADD_SHOP_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ADD_SHOP_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        shops: [...state.shops, payload],
        status: true,
      };

    case actionType.ADD_SHOP_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //   GET ALL SHOPS 

    case actionType.GET_ALL_SHOP_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.GET_ALL_SHOP_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        shops: payload.shops,
        error: null,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.GET_ALL_SHOP_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        status: false,
        loading: false,
      };

      // EDIT

    case actionType.EDIT_SHOP_REQUEST_SEND:
        return {
          ...state,
          loading: true,
          status: false,
        };
  
      case actionType.EDIT_SHOP_REQUEST_SUCCESS:
        const updateData = state.shops.map((item) =>
          item._id == payload._id ? payload : item
        );
  
        return {
          ...state,
          loading: false,
          status: true,
          shops: updateData,
          error: null,
        };
      case actionType.EDIT_SHOP_REQUEST_FAIL:
        return {
          ...state,
          loading: false,
          status: false,
          error: payload,
        };
        // DELETE
        case actionType.DELETE_SHOP_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.DELETE_SHOP_REQUEST_SUCCESS:
      const filered = state.shops.filter((item) =>
        item._id != payload._id 
      );

      return {
        ...state,
        loading: false,
        status: true,
        shops: filered,
        error: null,
      };
    case actionType.DELETE_SHOP_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };


    case actionType.UPDATE_STATUS_KEY:
      return {
        ...state,
        loading: false,
        statusKey: payload,
      };

    case actionType.UPDATE_SORT_BY_KEY:
      return {
        ...state,
        loading: false,
        sortByKey: payload,
      };

    case actionType.UPDATE_TYPE_KEY:
      return {
        ...state,
        loading: false,
        typeKey: payload,
      };

    case actionType.UPDATE_SEARCH_KEY:
      return {
        ...state,
        loading: false,
        searchKey: payload,
      };

      case actionType.SET_STATUS_FALSE:
      return {
        ...state,
        loading: false,
        status: false
      };

    default:
      return state;
  }
};

export default shopReducer;
