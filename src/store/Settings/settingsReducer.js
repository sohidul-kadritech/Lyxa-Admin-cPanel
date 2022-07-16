import * as actionType from "../actionType";

const initialState = {
  loading: false,
  status: false,
  error: null,
  googleMapKey: "",
  nearByShopKm: 0,
  deliveryFeePerKm: "",
  searchDeliveryBoyKm: [],
  dropCharges: [],
  cancelReasons: [],
  typeKey: "all",
  activeStatus: "all",
};

const settingsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // ADMIN
    case actionType.UPDATE_GOOGLE_KEY:
      return {
        ...state,
        googleMapKey: payload,
      };

    case actionType.UPDATE_DELIVERY_FEE:
      return {
        ...state,
        deliveryFeePerKm: payload,
      };

    case actionType.UPDATE_SEARCH_DELIVERY_BOY_KM:
      return {
        ...state,
        searchDeliveryBoyKm: [...state.searchDeliveryBoyKm, payload],
      };

    case actionType.REMOVE_SEARCH_DELIVERY_BOY_KM:
      let list = [...state.searchDeliveryBoyKm];
      list.splice(payload, 1);
      return {
        ...state,
        searchDeliveryBoyKm: list,
      };

    case actionType.ALL_ADMIN_SETTINGS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.ALL_ADMIN_SETTINGS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        googleMapKey: payload.googleApiKey,
        searchDeliveryBoyKm: payload.searchDeliveryBoyKm,
      };

    case actionType.ALL_ADMIN_SETTINGS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // EDIT

    case actionType.UPDATE_ADMIN_SETTINGS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.UPDATE_ADMIN_SETTINGS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.UPDATE_ADMIN_SETTINGS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // APP

    case actionType.UPDATE_NEAR_BY_SHOP:
      return {
        ...state,
        nearByShopKm: payload,
      };

    case actionType.UPDATE_APP_SETTINGS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.UPDATE_APP_SETTINGS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
      };

    case actionType.UPDATE_APP_SETTINGS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.ALL_APP_SETTINGS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };

    case actionType.ALL_APP_SETTINGS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        nearByShopKm: payload.nearByShopKm,
      };

    case actionType.ALL_APP_SETTINGS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //   ADD DELIVERY FEE
    case actionType.ADD_DELIVERY_FEE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionType.ADD_DELIVERY_FEE_REQUEST_SUCCESS:
      return {
        ...state,
        dropCharges: [...state.dropCharges, payload],
        loading: false,
        status: true,
      };
    case actionType.ADD_DELIVERY_FEE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    // ADD CANCEL REASON

    case actionType.ADD_REASON_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionType.ADD_REASON_REQUEST_SUCCESS:
      return {
        ...state,
        cancelReasons: [...state.cancelReasons, payload],
        loading: false,
        status: true,
      };
    case actionType.ADD_REASON_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // ALL CANCEL REASON

    case actionType.ALL_REASONS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionType.ALL_REASONS_REQUEST_SUCCESS:
      return {
        ...state,
        cancelReasons: payload,
        loading: false,
        status: false,
      };
    case actionType.ALL_REASONS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.UPDATE_REASON_TYPE_KEY:
      return {
        ...state,
        typeKey: payload,
      };

    case actionType.UPDATE_REASON_STATUS_KEY:
      return {
        ...state,
        activeStatus: payload,
      };

    case actionType.UPDATE_REASON_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };
    case actionType.UPDATE_REASON_REQUEST_SUCCESS:
      return {
        ...state,
        cancelReasons: state.cancelReasons.map((item) =>
          item._id === payload._id ? payload : item
        ),
        loading: false,
        status: true,
      };

    case actionType.UPDATE_REASON_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default settingsReducer;
