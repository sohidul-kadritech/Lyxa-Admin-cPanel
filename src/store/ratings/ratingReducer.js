/* eslint-disable default-param-last */
import * as actionType from '../actionType';

const initialState = {
  loading: true,
  ratings: [],
  error: '',
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

    default:
      return state;
  }
};

export default ratingReducer;
