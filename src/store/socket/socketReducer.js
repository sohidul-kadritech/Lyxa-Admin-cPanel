/* eslint-disable default-param-last */
import * as actionType from '../actionType';

const initialState = {
  socket: null,
  message: '',
  loading: false,
  error: null,
};

const socketReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.SOCKET_CONNECT_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionType.SOCKET_CONNECT_SUCCESS:
      return {
        ...state,
        socket: payload,
        loading: false,
      };
    case actionType.SOCKET_CONNECT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default socketReducer;
