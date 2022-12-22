import {
  UPDATE_TERMS_CONDITION_REQUEST_FAIL,
  UPDATE_TERMS_CONDITION_REQUEST_SEND,
  UPDATE_TERMS_CONDITION_REQUEST_SUCCESS,
} from "../actionType";

const initialState = {
  loading: false,
  status: false,
  description: "",
  error: null,
};

const termsAndConditonReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_TERMS_CONDITION_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case UPDATE_TERMS_CONDITION_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        description: payload,
      };
    case UPDATE_TERMS_CONDITION_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default termsAndConditonReducer;
