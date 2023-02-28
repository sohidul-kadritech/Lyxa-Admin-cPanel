/* eslint-disable default-param-last */
import * as actionType from '../actionType';

const initialState = {
  loading: false,
  chatReasons: [],
  errorMessage: '',
  newFaq: '',
  pagination: {
    page: 1,
    pagesize: 50,
    pagingRange: 50,
  },
};

export default function chatReasonReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case actionType.GET_ALL_CHAT_REASON_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.GET_ALL_CHAT_REASON_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        chatReasons: payload,
      };

    case actionType.GET_ALL_CHAT_REASON_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: payload,
      };

    case actionType.UPDATE_CHAT_REASON_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case actionType.UPDATE_CHAT_REASON_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        chatReasons: payload,
      };

    case actionType.UPDATE_CHAT_REASON_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: '',
      };

    case actionType.ADD_CHAT_REASON_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case actionType.ADD_CHAT_REASON_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        newFaq: payload?._id,
        chatReasons: [...state.chatReasons, payload],
      };

    case actionType.ADD_CHAT_REASON_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: payload,
      };

    case actionType.DELETE_CHAT_REASON_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case actionType.DELETE_CHAT_REASON_REQUEST_SUCCESS:
      console.log(payload);
      return {
        ...state,
        loading: false,
        chatReasons: payload,
      };

    case actionType.DELETE_CHAT_REASON_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: payload,
      };

    default:
      return state;
  }
}
