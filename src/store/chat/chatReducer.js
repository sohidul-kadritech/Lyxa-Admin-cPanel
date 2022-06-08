import * as actionType from "../actionType";

const initialState = {
  loading: false,
  error: null,
  chats: [],
  status: false,
  typeKey: { label: "All", value: "all" },
  sortByKey: { label: "Desc", value: "desc" },
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
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
        chats: payload.request,
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
      };

    case actionType.ACCEPT_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.ACCEPT_CHAT_REQUEST_SUCCESS:
      const updateData = state.chats.map((item) =>
        item._id === payload._id ? payload : item
      );
      return {
        ...state,
        loading: false,
        status: true,
        chats: updateData,
      };

    case actionType.ACCEPT_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
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

    default:
      return state;
  }
};

export default chatReducer;
