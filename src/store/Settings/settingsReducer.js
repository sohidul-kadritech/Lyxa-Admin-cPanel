import * as actionType from "../actionType";

const initialState = {
  loading: false,
  status: false,
  error: null,
  googleMapKey: "",
  nearByShopKm: 0,
  deliveryFeePerKm: "",
  searchDeliveryBoyKm: [],
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
        searchDeliveryBoyKm: payload.searchDeliveryBoyKm

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

    default:
      return state;
  }
};

export default settingsReducer;
