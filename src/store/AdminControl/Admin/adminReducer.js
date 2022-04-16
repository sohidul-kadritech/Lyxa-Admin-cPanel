import * as actionType from "../../actionType";

const initialState = {
  loading: false,
  admins: [],
  error: null,
  status: false,
};

const adminReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {

    // ADD

    case actionType.ADD_ADMIN_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };
    case actionType.ADD_ADMIN_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        admins: [...state.admins,payload],
        error: null
      };
    case actionType.ADD_ADMIN_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

      // GET ALL_

      case actionType.GET_ALL_ADMIN_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };
    case actionType.GET_ALL_ADMIN_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: false,
        admins: payload,
        error: null
      };
    case actionType.GET_ALL_ADMIN_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

      // DELETE 

      case actionType.DELETE_ADMIN_REQUEST_SEND:
        return {
          ...state,
          loading: true,
          status: false,
        };
      case actionType.DELETE_ADMIN_REQUEST_SUCCESS:
        return {
          ...state,
          loading: false,
          status: true,
          error: null
        };
      case actionType.DELETE_ADMIN_REQUEST_FAIL:
        return {
          ...state,
          loading: false,
          status: false,
          error: payload,
        };

    default:
      return state;
  }
};

export default adminReducer;
