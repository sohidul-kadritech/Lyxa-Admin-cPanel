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
  liveStatus: { label: "All", value: "all" },
  cuisines: [],
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
      const filered = state.shops.filter((item) => item._id != payload);

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

    // ADD SHOP DEALS
    case actionType.ADD_SHOP_DEAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.ADD_SHOP_DEAL_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        shops: state.shops.map((item) => {
          if (item._id === payload._id) {
            return payload;
          }
          return item;
        }),
        error: null,
      };
    case actionType.ADD_SHOP_DEAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // DELETE SHOP DEAL

    case actionType.DELETE_SHOP_DEAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.DELETE_SHOP_DEAL_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        shops: state.shops.filter((item) => item._id !== payload._id),
        error: null,
      };
    case actionType.DELETE_SHOP_DEAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // CHANGE LIVE STATUS

    case actionType.SHOP_LIVE_STATUS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.SHOP_LIVE_STATUS_REQUEST_SUCCESS:
      const data = state.shops.map((item) =>
        item._id == payload._id ? payload : item
      );

      return {
        ...state,
        loading: false,
        status: true,
        shops: data,
        error: null,
      };
    case actionType.SHOP_LIVE_STATUS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // CUISINE

    case actionType.ADD_CUISINE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.ADD_CUISINE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        cuisines: [...state.cuisines, payload],
      };

    case actionType.ADD_CUISINE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.ALL_CUISINES_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.ALL_CUISINES_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: false,
        cuisines: payload,
      };

    case actionType.ALL_CUISINES_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.EDIT_CUISINE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.EDIT_CUISINE_REQUEST_SUCCESS:
      const update = state.cuisines.map((item) =>
        item._id == payload._id ? payload : item
      );
      return {
        ...state,
        loading: false,
        status: true,
        cuisines: update,
      };

    case actionType.EDIT_CUISINE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.UPDATE_SHOP_STATUS_KEY:
      return {
        ...state,
        loading: false,
        statusKey: payload,
      };

    case actionType.UPDATE_SHOP_SORT_BY_KEY:
      return {
        ...state,
        sortByKey: payload,
      };

    case actionType.UPDATE_SHOP_TYPE_KEY:
      return {
        ...state,
        typeKey: payload,
      };

    case actionType.UPDATE_SHOP_SEARCH_KEY:
      return {
        ...state,
        searchKey: payload,
      };

    case actionType.UPDATE_SHOP_LIVE_STATUS:
      return {
        ...state,
        liveStatus: payload,
      };

    case actionType.SET_STATUS_FALSE:
      return {
        ...state,
        status: false,
      };

    // SET AS FEATURED SHOP

    case actionType.SET_FEATURED_SHOP_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.SET_FEATURED_SHOP_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };
    case actionType.SET_FEATURED_SHOP_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.UPDATE_SHOP_STATUS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.UPDATE_SHOP_STATUS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };
    case actionType.UPDATE_SHOP_STATUS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default shopReducer;
