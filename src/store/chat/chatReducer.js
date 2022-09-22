import * as actionType from "../actionType";

const initialState = {
  loading: false,
  error: null,
  chatRequests: [],
  status: false,
  typeKey: { label: "All", value: "all" },
  sortByKey: { label: "Desc", value: "desc" },
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  selectedMsg: '',
  isSelected: true
};

const chatReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionType.ALL_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionType.ALL_CHAT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        chatRequests: payload.request,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionType.ALL_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case actionType.ACCEPT_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.ACCEPT_CHAT_REQUEST_SUCCESS:

      return {
        ...state,
        loading: false,
        status: true,
        chatRequests: state.chatRequests.map((item) =>
          item._id === payload._id ? payload : item
        )
      };

    case actionType.ACCEPT_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case actionType.SEND_MSG_TO_USER_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.SEND_MSG_TO_USER_REQUEST_SUCCESS:

      return {
        ...state,
        loading: false,
        status: true,
        chatRequests: state.chatRequests.map((item) =>
          item._id === payload._id ? { ...item, chats: payload?.chats } : item
        )
      };

    case actionType.SEND_MSG_TO_USER_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false
      };

    case actionType.REJECT_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.REJECT_CHAT_REQUEST_SUCCESS:

      return {
        ...state,
        loading: false,
        status: true,
        chatRequests: state.chatRequests.map((item) =>
          item._id === payload._id ? { ...item, status: payload.status } : item
        )
      };

    case actionType.REJECT_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false
      };

    // FILTERS
    case actionType.UPDATE_CHAT_SORT_BY_FILTER:
      return {
        ...state,
        sortByKey: payload,
      };

    case actionType.UPDATE_CHAT_TYPE_FILTER:
      return {
        ...state,
        typeKey: payload,
      };

    case actionType.SELECT_DEFAULT_MSG:
      return {
        ...state,
        selectedMsg: payload,
      };

    default:
      return state;
  }
};

export default chatReducer;
