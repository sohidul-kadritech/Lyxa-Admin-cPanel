import * as actionType from "../actionType";

const initialState = {
  loading: false,
  error: null,
  deliveryMans: [],
  status: false,
  sortByKey: { label: "Desc", value: "desc" },
  statusKey: { label: "All", value: "all" },
  searchKey: "",
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  orders: [],
};

const deliveryManReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.ADD_DELIVERY_MAN_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };
    case actionType.ADD_DELIVERY_MAN_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        deliveryMans: [...state.deliveryMans, payload],
      };

    case actionType.ADD_DELIVERY_MAN_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // GET ALL

    case actionType.ALL_DELIVERY_MAN_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ALL_DELIVERY_MAN_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        deliveryMans: payload.deliveryBoys,
        error: null,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
      };

    case actionType.ALL_DELIVERY_MAN_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    // EDIT

    case actionType.EDIT_DELIVERY_MAN_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
        status: false,
      };
    case actionType.EDIT_DELIVERY_MAN_REQUEST_SUCCESS:
      const updateData = state.deliveryMans.map((man) =>
        man._id === payload._id ? payload : man
      );
      return {
        ...state,
        loading: false,
        status: true,
        deliveryMans: updateData,
      };

    case actionType.EDIT_DELIVERY_MAN_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // FILTER OPTIONS

    case actionType.UPDATE_SORT_BY_KEY:
      return {
        ...state,
        sortByKey: payload,
      };

    case actionType.UPDATE_STATUS_KEY:
      return {
        ...state,
        statusKey: payload,
      };

    case actionType.UPDATE_SEARCH_KEY:
      return {
        ...state,
        searchKey: payload,
      };

    case actionType.SET_STATUS_FALSE:
      return {
        ...state,
        status: false,
      };

    // ORDERS
    case actionType.DELIVERYBOY_ORDERS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionType.DELIVERYBOY_ORDERS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: payload,
        // paginate: payload.paginate,
        // paging: payload.paginate.metadata.paging,
        // hasNextPage: payload.paginate.metadata.hasNextPage,
        // currentPage: payload.paginate.metadata.page.currentPage,
        // hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: true,
      };

    case actionType.DELIVERYBOY_ORDERS_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
      };

    default:
      return state;
  }
};

export default deliveryManReducer;
