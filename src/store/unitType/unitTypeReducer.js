/* eslint-disable default-param-last */
import * as actionType from '../actionType';

const initialState = {
  loading: false,
  error: null,
  unitTypes: [],
  status: false,
};

const unitTypeReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionType.ADD_UNIT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };
    case actionType.ADD_UNIT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        unitTypes: [...state.unitTypes, payload],
        status: true,
      };
    case actionType.ADD_UNIT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //   GET ALL
    case actionType.GET_ALL_UNIT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };
    case actionType.GET_ALL_UNIT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        unitTypes: payload,
      };
    case actionType.GET_ALL_UNIT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //   UPDAT UNIT
    case actionType.EDIT_UNIT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.EDIT_UNIT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        unitTypes: state.unitTypes.map((item) => {
          if (item._id === payload._id) {
            return payload;
          }
          return item;
        }),
        status: true,
      };

    case actionType.EDIT_UNIT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //   DELETE UNIT
    case actionType.DELETE_UNIT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.DELETE_UNIT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        unitTypes: state.unitTypes.filter((item) => item._id !== payload),
        status: true,
      };

    case actionType.DELETE_UNIT_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default unitTypeReducer;
