import * as actionType from "../actionType";

const initialState = {
  loading: false,
  categories: [],
  status: false,
  error: false,
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  subCategories: [],
  subPaginate: null,
  subPaging: [],
  subHasNextPage: true,
  subCurrentPage: 1,
  subHasPreviousPage: false,
  subSearchKey: "",
  subStatusKey: { label: "All", value: "all" },
};

const categoryReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionType.ADD_CATEGORY_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ADD_CATEGORY_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        categories: [...state.categories, payload],
      };

    case actionType.ADD_CATEGORY_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // GET ALL

    case actionType.GET_ALL_CATEGORY_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.GET_ALL_CATEGORY_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: payload.categories,
        error: null,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.GET_ALL_CATEGORY_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        status: false,
        loading: false,
      };

    // EDIT

    case actionType.EDIT_CATEGORY_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.EDIT_CATEGORY_REQUEST_SUCCESS:
      const updateData = state.categories.map((item) =>
        item._id == payload._id ? payload : item
      );

      return {
        ...state,
        loading: false,
        status: true,
        categories: updateData,
        error: null,
      };
    case actionType.EDIT_CATEGORY_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // SET STATUS FALSE

    case actionType.SET_STATUS_FALSE:
      return {
        ...state,
        status: false,
      };

    // ADD SUB CATEGORY

    case actionType.ADD_SUB_CATEGORY_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.ADD_SUB_CATEGORY_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        status: true,
        subCategories: [...state.subCategories, payload],
      };

    case actionType.ADD_SUB_CATEGORY_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        status: false,
      };

    // GET ALL SUB CATEGORY

    case actionType.GET_ALL_SUB_CATEGORY_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.GET_ALL_SUB_CATEGORY_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        subCategories: payload.subCategories,
        error: null,
        subPaginate: payload.paginate,
        subPaging: payload.paginate.metadata.paging,
        subHasNextPage: payload.paginate.metadata.hasNextPage,
        subCurrentPage: payload.paginate.metadata.page.currentPage,
        subHasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.GET_ALL_SUB_CATEGORY_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        status: false,
        loading: false,
      };

      // EDIT SUB CATEGORY 
      case actionType.EDIT_SUB_CATEGORY_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.EDIT_SUB_CATEGORY_REQUEST_SUCCESS:
      const update = state.subCategories.map((item) =>
        item._id == payload._id ? payload : item
      );

      return {
        ...state,
        loading: false,
        status: true,
        subCategories: update,
        error: null,
      };
    case actionType.EDIT_SUB_CATEGORY_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

      // DELETE 
      case actionType.DELETE_SUB_CATEGORY_REQUEST_SEND:
        return {
          ...state,
          loading: true,
          status: false,
        };
  
      case actionType.DELETE_SUB_CATEGORY_REQUEST_SUCCESS:
        const filered = state.subCategories.filter((item) =>
          item._id != payload._id 
        );
  
        return {
          ...state,
          loading: false,
          status: true,
          subCategories: filered,
          error: null,
        };
      case actionType.DELETE_SUB_CATEGORY_REQUEST_FAIL:
        return {
          ...state,
          loading: false,
          status: false,
          error: payload,
        };

      case actionType.UPDATE_SEARCH_KEY:
      return {
        ...state,
        loading: false,
        subSearchKey: payload,
      };

      case actionType.UPDATE_STATUS_KEY:
      return {
        ...state,
        loading: false,
        subStatusKey: payload,
      };

    default:
      return state;
  }
};

export default categoryReducer;
