import * as actionType from "../actionType";

const initialState = {
  laoding: false,
  users: [],
  message: null,
  error: null,
  sortByKey: "desc",
  searchKey: "",
  statusKey: "all",
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  status: false
};

const usersReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // ALL USERS

    case actionType.GET_ALL_USERS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        message: null,
        errro: null,
      };

    case actionType.GET_ALL_USERS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        users: payload.users,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.GET_ALL_USERS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        message: null,
        errro: payload,
      };

    //   UPDATE SORT BY KEY

    case actionType.UPDATE_USERS_SORT_KEY:
      return {
        ...state,
        sortByKey: payload,
      };

    //   UPDATE SEARCH KEY

    case actionType.UPDATE_USERS_SEARCH_KEY:
      return {
        ...state,
        searchKey: payload,
      };

      // UPDATE USER STATUS KEY 

      case actionType.UPDATE_STATUS_KEY:
      return {
        ...state,
        statusKey: payload,
      };



    default:
      return state;
  }
};

export default usersReducer;
