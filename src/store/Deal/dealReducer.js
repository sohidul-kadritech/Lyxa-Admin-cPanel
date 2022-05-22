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

    default:
      return state;
  }
};

export default dealReducer;
