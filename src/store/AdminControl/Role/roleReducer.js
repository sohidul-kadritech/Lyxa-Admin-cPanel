import * as actionType from "../../actionType";

const initialState = {
  loading: false,
  roles: [],
  message: null,
  error: null
};

export const roleReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // ADD ROLE
    case actionType.CREATE_ADMIN_ROLE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        message: null
      };
    case actionType.CREATE_ADMIN_ROLE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        message: payload,
        error: null
      };

    case actionType.GET_CREATED_ADMIN_ROLE:
      return {
        ...state,
        loading: false,
        roles: [...state.roles, payload],
        message: null,
        error: null
      };

    case actionType.CREATE_ADMIN_ROLE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        message: null,
        error: payload
      };

    //   GET ALL ROLE

    case actionType.GET_ALL_ROLE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        message: null
      };

    case actionType.GET_ALL_ROLE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        message: null,
        roles: payload
      };

    case actionType.GET_ALL_ROLE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        message: null
      };

    // EDIT ADMIN ROLE

    case actionType.EDIT_ADMIN_ROLE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        message: null
      };

    case actionType.EDIT_ADMIN_ROLE_REQUEST_SUCCESS:
      const updateData = state.roles.map(
        item => (item.id === payload.role.id ? payload.role : item)
      );
      return {
        ...state,
        loading: false,
        error: null,
        message: payload.message,
        roles: updateData
      };

    case actionType.EDIT_ADMIN_ROLE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        message: null
      };

    //  DELETE ROLE

    case actionType.DELETE_ROLE_REQUEST_SEND:
      return {
        ...state,
        loading: true
      };

    case actionType.DELETE_ROLE_REQUEST_SUCCESS:
      const data = state.roles.map(
        item => (item.id === payload.role.id ? payload.role : item)
      );
      return {
        ...state,
        loading: false,
        roles: data,
        message: payload.message,
        error: null
      };
    case actionType.DELETE_ROLE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        message: null,
        error: payload
      };

    // RESTORE ROLE

    case actionType.RESTORE_ROLE_REQUEST_SEND:
      return {
        ...state,
        loading: true
      };

    case actionType.RESTORE_ROLE_REQUEST_SUCCESS:
      const newData = state.roles.map(
        item => (item.id === payload.role.id ? payload.role : item)
      );
      return {
        ...state,
        loading: false,
        roles: newData,
        message: payload.message,
        error: null
      };
    case actionType.RESTORE_ROLE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        message: null,
        error: payload
      };

    default:
      return state;
  }
};
