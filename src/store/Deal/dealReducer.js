import * as actionType from "../actionType";

const initialState = {
  loading: false,
  error: null,
  deals: [],
  status: false,
};

const dealReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // ADD
    case actionType.ADD_DEAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ADD_DEAL_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        deals: [...state.deals, payload],
      };

    case actionType.ADD_DEAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // UPDATE

    case actionType.EDIT_DEAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.EDIT_DEAL_REQUEST_SUCCESS:
      const updateData = state.deals.map((item) =>
        item._id === payload._id ? payload : item
      );
      return {
        ...state,
        loading: false,
        status: true,
        deals: updateData,
      };

    case actionType.EDIT_DEAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // DELETE

    case actionType.DELETE_DEAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.DELETE_DEAL_REQUEST_SUCCESS:
      const filteredData = state.deals.filter(
        (item) => item._id !== payload._id
      );
      return {
        ...state,
        loading: false,
        status: true,
        deals: filteredData,
      };

    case actionType.DELETE_DEAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // GET ALL

    case actionType.ALL_DEAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ALL_DEAL_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        deals: payload,
      };

    case actionType.ALL_DEAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default dealReducer;
