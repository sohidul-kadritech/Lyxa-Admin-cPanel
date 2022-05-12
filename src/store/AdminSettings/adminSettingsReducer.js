import * as actionType from "../actionType";

const initialState = {
  loading: false,
  cuisines: [],
  status: false,
  error: null,
};

const adminSettingsReducer = (state = initialState, actionType) => {
  const { type, payload } = actionType;

  switch (type) {
    // ADD CUISINE
    case actionType.ADD_CUISINE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
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

    default:
      return state;
  }
};

export default adminSettingsReducer;
