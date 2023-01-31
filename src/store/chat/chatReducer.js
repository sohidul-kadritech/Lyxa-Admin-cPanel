import { actionTypes } from "redux-form";
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
  selectedMsg: "",
  isSelected: true,
  isSendingMsg: false,
  isChatClose: false,
  isChatAccepted: false,
  orderChatSearchKey: "",
  openChats: 0,
};

const chatReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionType.ALL_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };

    case actionType.ALL_CHAT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        chatRequests: payload.list,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.ALL_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
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
        isChatAccepted: true,
        chatRequests: state.chatRequests.map((item) =>
          item._id === payload._id ? payload : item
        ),
      };

    case actionTypes.SET_CHAT_ACCEPT: 
    return {
      ...state,
      isChatAccepted: payload,
    }
    
    case actionType.ACCEPT_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case actionType.SEND_MSG_TO_USER_REQUEST_SEND:
      return {
        ...state,
        isSendingMsg: true,
        error: null,
        status: false,
      };

    case actionType.SEND_MSG_TO_USER_REQUEST_SUCCESS:
      return {
        ...state,
        // loading: false,
        status: true,
        isSendingMsg: false,
        chatRequests: state.chatRequests.map((item) =>
          item._id === payload._id
            ? { ...item, chats: [...item?.chats, payload] }
            : item
        ),
      };

    case actionType.SEND_MSG_TO_USER_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        isSendingMsg: false,
        status: false,
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
        ),
      };

    case actionType.REJECT_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
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

    case actionType.CLOSE_CONVERSATION_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        isChatClose: false,
      };

    case actionType.CLOSE_CONVERSATION_REQUEST_SUCCESS:
      return {
        ...state,
        isChatClose: true,
        isChatAccepted: false,
        loading: false,
      };

    case actionType.CLOSE_CONVERSATION_REQUEST_FAIL:
      return {
        ...state,
        isChatClose: false,
        loading: false,
        error: payload,
      };

    case actionType.SET_STATUS_FALSE:
      return {
        ...state,
        status: false,
        isChatClose: false,
      };

    case actionType.UPDATE_ORDER_CHAT_SEARCH_KEY:
      return {
        ...state,
        orderChatSearchKey: payload,
      };

    // UNSEEN CHAT REQUESTS
    case actionType.OPEN_CHATS_VALUE: {
      return {
        ...state,
        openChats: payload
      }
    }

    case actionType.OPEN_CHATS_INCREMENT_VALUE: {
      return {
        ...state,
        openChats: state.openChats + 1
      }
    }

    case actionType.OPEN_CHATS_DECREMENT_VALUE: {
      return {
        ...state,
        openChats: state.openChats - 1
      }
    }
    default:
      return state;
  }
};

export default chatReducer;
