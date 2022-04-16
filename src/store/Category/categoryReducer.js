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

    default:
      return state;
  }
};

export default categoryReducer;
