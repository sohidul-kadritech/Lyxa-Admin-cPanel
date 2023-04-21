/* eslint-disable default-param-last */
import * as actionType from '../actionType';

const initialState = {
  loading: true,
  ratings: [],
  error: '',
  isAdded: false,
  isUpdated: false,
};

const ratingReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.GET_ALL_RATINGS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: '',
      };

    case actionType.GET_ALL_RATINGS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        ratings: payload,
      };

    case actionType.GET_ALL_RATINGS_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    case actionType.ADD_NEW_RATING_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.ADD_NEW_RATING_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        ratings: payload,
        isAdded: true,
      };

    case actionType.ADD_NEW_RATING_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    case actionType.UPDATE_RATING_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        isUpdated: false,
      };

    case actionType.UPDATE_RATING_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        ratings: payload,
        isUpdated: true,
      };

    case actionType.UPDATE_RATING_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    case actionType.UPDATE_RATING_IS_ADDED:
      return {
        ...state,
        isAdded: payload,
      };

    case actionType.UPDATE_RATING_IS_UPDATED:
      return {
        ...state,
        isUpdated: payload,
      };

    default:
      return state;
  }
};

export default ratingReducer;
