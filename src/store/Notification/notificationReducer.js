/* eslint-disable default-param-last */
import * as actionType from '../actionType';

const initialState = {
  loading: false,
  notifications: [],
  error: null,
  status: false,
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  activeStatus: { label: 'All', value: 'all' },
  accountType: { label: 'All', value: 'all' },
  type: { label: 'All', value: 'all' },
};

const notificationReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.CREATE_NOTIFICATION_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };
    case actionType.CREATE_NOTIFICATION_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        notifications: [...state.notifications, payload],
      };

    case actionType.CREATE_NOTIFICATION_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.ALL_NOTIFICATIONS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ALL_NOTIFICATIONS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: payload.notifications,
        error: null,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.ALL_NOTIFICATIONS_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        status: false,
        loading: false,
      };

    case actionType.UPDATE_NOTIFICATION_STATUS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };
    case actionType.UPDATE_NOTIFICATION_STATUS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.UPDATE_NOTIFICATION_STATUS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.UPDATE_NOTIFICATION_ACTIVE_STATUS:
      return {
        ...state,
        activeStatus: payload,
      };

    case actionType.UPDATE_NOTIFICATION_ACCOUNT_TYPE:
      return {
        ...state,
        accountType: payload,
      };

    case actionType.UPDATE_NOTIFICATION_TYPE:
      return {
        ...state,
        type: payload,
      };

    default:
      return state;
  }
};

export default notificationReducer;
