/* eslint-disable default-param-last */
import * as actionType from '../actionType';

const initialState = {
  loading: false,
  faq: [],
  errorMessage: '',
  isAdded: false,
  isUpdated: false,
  pagination: {
    page: 1,
    pagesize: 50,
    pagingRange: 50,
  },
};

export default function faqReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case actionType.GET_ALL_FAQ_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.GET_ALL_FAQ_REQUEST_SUCCESS:
      console.log(payload);
      return {
        ...state,
        loading: false,
        faq: payload,
      };

    case actionType.GET_ALL_FAQ_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: payload,
      };

    case actionType.UPDATE_FAQ_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case actionType.UPDATE_FAQ_REQUEST_SUCCESS:
      return {
        ...state,
        isUpdated: true,
        loading: false,
        faq: payload,
      };

    case actionType.UPDATE_FAQ_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: '',
      };

    case actionType.UPDATE_FAQ_IS_UPDATED:
      return {
        ...state,
        isUpdated: payload,
      };

    case actionType.ADD_FAQ_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case actionType.ADD_FAQ_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        newFaq: payload?._id,
        faq: [...state.faq, payload],
        isAdded: true,
      };

    case actionType.ADD_FAQ_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: payload,
      };

    case actionType.UPDATE_FAQ_IS_ADDED:
      return {
        ...state,
        isAdded: payload,
      };

    case actionType.DELETE_FAQ_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };

    case actionType.DELETE_FAQ_REQUEST_SUCCESS:
      console.log(payload);
      return {
        ...state,
        loading: false,
        faq: payload,
      };

    case actionType.DELETE_FAQ_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: payload,
      };

    default:
      return state;
  }
}
