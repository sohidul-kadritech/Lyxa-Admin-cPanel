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
        admins: [...state.admins, payload],
        error: null,
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
        error: null,
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
      let index = state.admins
        .map((x) => {
          return x._id;
        })
        .indexOf(payload?._id);
      state.admins.splice(index, 1);

      return {
        ...state,
        loading: false,
        status: true,
        error: null,
      };
    case actionType.DELETE_ADMIN_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // EDIT

    case actionType.EDIT_ADMIN_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
      };

    case actionType.EDIT_ADMIN_REQUEST_SUCCESS:
      const updateData = state.admins.map((item) =>
        item._id == payload._id ? payload : item
      );

      return {
        ...state,
        loading: false,
        status: true,
        admins: updateData,
        error: null,
      };
    case actionType.EDIT_ADMIN_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    // SET STATUS FALSE

    case actionType.SET_STATUS_FALSE:
      return {
        ...state,
        status: false,
      };

    // ADD SELLER CREDENTIAL

    case actionType.ADD_SELLER_CREDENTIAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ADD_SELLER_CREDENTIAL_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.ADD_SELLER_CREDENTIAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // ADD SHOP CREDENTIAL

    case actionType.ADD_SHOP_CREDENTIAL_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ADD_SHOP_CREDENTIAL_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.ADD_SHOP_CREDENTIAL_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default adminReducer;
