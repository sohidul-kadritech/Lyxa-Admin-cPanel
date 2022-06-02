import * as actionTypes from "../actionType";

const init = {
  loading: false,
  error: null,
  status: false,
  deliveryFee: null,
};

const appWalletReducer = (state = init, action) => {
  const { type, payload } = action;

  switch (type) {
    //   ADD DELIVERY FEE
    case actionTypes.ADD_DELIVERY_FEE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_DELIVERY_FEE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };
    case actionTypes.ADD_DELIVERY_FEE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    //   GET DELIVERY FEE
    case actionTypes.GET_DELIVERY_FEE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_DELIVERY_FEE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: false,
        deliveryFee: payload,
      };
    case actionTypes.GET_DELIVERY_FEE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default appWalletReducer;
