import * as actionTypes from "../actionType";
import {
  DELETE_BANNER_REQUEST_SEND,
  DELETE_BANNER_REQUEST_SUCCESS,
  GET_DELETED_BANNER_DATA,
  DELETE_BANNER_REQUEST_FAIL,
  EDIT_BANNER_REQUEST_SEND,
} from "./../actionType";

const initialState = {
  loading: false,
  list: [],
  error: null,
  type: "all"

};

const bannerReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {

    case actionTypes.BANNER_FILTER_SELECT:
      return {
        ...state,
        type: payload
      };

    case actionTypes.BANNER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.BANNER_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        list: payload,
        error: null,
        status: false
      };

    case actionTypes.BANNER_REQUEST_ADD:
      return {
        ...state,
        list: [...state.list, payload],
        error: null,
      };

    case actionTypes.BANNER_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // DELETE BANNER

    case DELETE_BANNER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case DELETE_BANNER_REQUEST_SUCCESS:
      const filtered = state.list.filter((banner) => banner._id != payload);
      return {
        ...state,
        loading: false,
        message: null,
        list: filtered,
        error: null,
      };
    case DELETE_BANNER_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        message: null,
        error: payload,
      };
    //  EDIT BANNER

    case actionTypes.EDIT_BANNER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionTypes.GET_EDITED_BANNER:
      const updateData = state.list.map((item) =>
        item._id === payload._id ? payload : item
      );

      return {
        ...state,
        loading: false,
        status: true,
        error: null,
        list: updateData,
      };

    // case actionTypes.OPEN_EDIT_PAGE:
    //     return {
    //         ...state,
    //         editDone: false
    //     }

    case actionTypes.EDIT_BANNER_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        message: null,
        error: payload,
      };


    // BANNER ADD

    case actionTypes.BANNER_ADD_REQUEST_SENT:
      return {
        ...state,
        loading: true,
        status: false
      };

    case actionTypes.BANNER_ADD_REQUEST_SUCCESS:
      return {
        ...state,
        list: [...state.list, payload],
        loading: false,
        error: null,
        status: true,
      };

    case actionTypes.BANNER_ADD_REQUEST_FAIL:
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

export default bannerReducer;
