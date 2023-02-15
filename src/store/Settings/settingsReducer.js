/* eslint-disable no-case-declarations */
/* eslint-disable default-param-last */
import * as actionType from '../actionType';

const initialState = {
  loading: false,
  status: false,
  error: null,
  googleMapKey: '',
  appSettingsOptions: {
    nearByShopKm: '',
    deliveryFeePerKm: '',
    maxDiscount: '',
    maxDistanceForButler: '',
    searchDeliveryBoyKm: [],
    searchDeliveryBoyKmForButler: [],
    maxCustomerServiceValue: '',
    vat: '',
    currency: localStorage.getItem('currency') ? JSON.parse(localStorage.getItem('currency')) : { code: '' },
  },

  dropCharge: null,
  cancelReasons: [],
  typeKey: 'all',
  activeStatus: 'all',
  sellersDropCharge: [],
  paginate: null,
  paging: [],
  hasNextPage: true,
  currentPage: 1,
  hasPreviousPage: false,
  adminLogType: { label: 'All', value: '' },
  logSortBy: { label: 'Desc', value: 'desc' },
  adminLogs: [],
  defualtMessages: [],
  searchKey: '',
  databaseCollections: [],
  message: '',
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
        appSettingsOptions: {
          ...state.appSettingsOptions,
          searchDeliveryBoyKm: [...state.appSettingsOptions.searchDeliveryBoyKm, payload],
        },
      };

    case actionType.UPDATE_SEARCH_BUTLER_KM:
      return {
        ...state,
        appSettingsOptions: {
          ...state.appSettingsOptions,
          searchDeliveryBoyKmForButler: [...state.appSettingsOptions.searchDeliveryBoyKmForButler, payload],
        },
      };

    case actionType.UPDATE_VAT:
      return {
        ...state,
        appSettingsOptions: {
          ...state.appSettingsOptions,
          vat: payload,
        },
      };

    case actionType.REMOVE_SEARCH_DELIVERY_BOY_KM:
      const list = [...state.appSettingsOptions.searchDeliveryBoyKm];
      list.splice(payload, 1);
      return {
        ...state,
        appSettingsOptions: {
          ...state.appSettingsOptions,
          searchDeliveryBoyKm: list,
        },
      };

    case actionType.REMOVE_SEARCH_BUTLER_KM:
      const list2 = [...state.appSettingsOptions.searchDeliveryBoyKmForButler];
      list2.splice(payload, 1);
      return {
        ...state,
        appSettingsOptions: {
          ...state.appSettingsOptions,
          searchDeliveryBoyKmForButler: list2,
        },
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
        appSettingsOptions: {
          ...state.appSettingsOptions,
          nearByShopKm: payload,
        },
      };

    case actionType.UPDATE_MAX_BUTLER_DISTANCE:
      return {
        ...state,
        appSettingsOptions: {
          ...state.appSettingsOptions,
          maxDistanceForButler: payload,
        },
      };

    case actionType.UPDATE_MAX_DISCOUNT:
      return {
        ...state,
        appSettingsOptions: {
          ...state.appSettingsOptions,
          maxDiscount: payload,
        },
      };

    case actionType.UPDATE_DROP_CREDIT_LIMIT:
      return {
        ...state,
        appSettingsOptions: {
          ...state.appSettingsOptions,
          maxCustomerServiceValue: payload,
        },
      };
    case actionType.UPDATE_DROP_CURRENCY:
      return {
        ...state,
        appSettingsOptions: {
          ...state.appSettingsOptions,
          currency: payload,
        },
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
        appSettingsOptions: payload,
      };

    case actionType.ALL_APP_SETTINGS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //   ADD PERCENTAGE
    case actionType.ADD_DELIVERY_FEE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionType.ADD_DELIVERY_FEE_REQUEST_SUCCESS:
      return {
        ...state,
        dropCharge: payload,
        loading: false,
        status: true,
      };
    case actionType.ADD_DELIVERY_FEE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // GET PERCENTATE

    case actionType.GET_PERCENTAGE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionType.GET_PERCENTAGE_REQUEST_SUCCESS:
      return {
        ...state,
        dropCharge: payload,
        loading: false,
        status: true,
      };
    case actionType.GET_PERCENTAGE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    //   UPDATE DELIVERY CUT

    case actionType.UPDATE_DELIVERY_CUT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionType.UPDATE_DELIVERY_CUT_REQUEST_SUCCESS:
      return {
        ...state,
        dropCharge: payload,
        loading: false,
        status: true,
      };
    case actionType.UPDATE_DELIVERY_CUT_REQUEST_FAIL:
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
        cancelReasons: state.cancelReasons.map((item) => (item._id === payload._id ? payload : item)),
        loading: false,
        status: true,
      };

    case actionType.UPDATE_REASON_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // GET SELLERS DROP CHARGE

    case actionType.SELLERS_SPECIAL_DROP_CHARGE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.SELLERS_SPECIAL_DROP_CHARGE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        sellersDropCharge: payload.sellers,
        error: null,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.SELLERS_SPECIAL_DROP_CHARGE_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        status: false,
        loading: false,
      };

    // DELETE SELLER DROP CHARGE

    case actionType.DELETE_SELLER_DROP_CHARGE_REQUEST_SEND:
      return {
        ...state,
        loading: true,
      };
    case actionType.DELETE_SELLER_DROP_CHARGE_REQUEST_SUCCESS:
      return {
        ...state,
        sellersDropCharge: state.sellersDropCharge.filter((item) => item._id !== payload),
        loading: false,
        status: true,
      };
    case actionType.DELETE_SELLER_DROP_CHARGE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    // ADMIN LOG

    case actionType.UPDATE_ADMIN_LOG_TYPE_KEY:
      return {
        ...state,
        adminLogType: payload,
      };

    case actionType.UPDATE_ADMIN_SORT_KEY:
      return {
        ...state,
        logSortBy: payload,
      };

    // ADMIN LOG HISTORY LIST

    case actionType.ALL_AMDIN_LOGS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ALL_AMDIN_LOGS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        adminLogs: payload.logs,
        paginate: payload.paginate,
        paging: payload.paginate.metadata.paging,
        hasNextPage: payload.paginate.metadata.hasNextPage,
        currentPage: payload.paginate.metadata.page.currentPage,
        hasPreviousPage: payload.paginate.metadata.hasPreviousPage,
        status: false,
      };

    case actionType.ALL_AMDIN_LOGS_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        status: false,
        loading: false,
      };

    // DEFAULT MESSAGES

    case actionType.ALL_DEFAULT_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ALL_DEFAULT_CHAT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        defualtMessages: payload,
        status: false,
      };

    case actionType.ALL_DEFAULT_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        status: false,
        loading: false,
      };

    case actionType.ADD_DEFAULT_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ADD_DEFAULT_CHAT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        defualtMessages: [...state.defualtMessages, payload],
        status: true,
      };

    case actionType.ADD_DEFAULT_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case actionType.EDIT_DEFAULT_CHAT_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.EDIT_DEFAULT_CHAT_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        defualtMessages: state.defualtMessages.map((item) => (item._id === payload._id ? payload : item)),
        status: true,
      };

    case actionType.EDIT_DEFAULT_CHAT_REQUEST_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case actionType.UPDATE_DEFAULT_MESSAGE_SEARCH_KEY:
      return {
        ...state,
        searchKey: payload,
      };

    case actionType.ALL_DATABASE_COLLECTIONS_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.ALL_DATABASE_COLLECTIONS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        error: null,
        databaseCollections: payload,
      };

    case actionType.ALL_DATABASE_COLLECTIONS_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
      };

    case actionType.DATABASE_COLLECTION_BACKUP_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.DATABASE_COLLECTION_BACKUP_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        error: null,
        message: payload,
      };

    case actionType.DATABASE_COLLECTION_BACKUP_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
        message: payload,
      };

    case actionType.DATABASE_RESTORE_LAST_COLLECTION_BACKUP_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
        message: '',
      };

    case actionType.DATABASE_RESTORE_LAST_COLLECTION_BACKUP_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        error: null,
        message: payload,
      };

    case actionType.DATABASE_RESTORE_LAST_COLLECTION_BACKUP_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
        message: payload,
      };

    case actionType.DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
        message: '',
      };

    case actionType.DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        error: null,
        message: payload,
      };

    case actionType.DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
        message: payload,
      };

    case actionType.DATABASE_DELETE_COLLECTION_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
        message: '',
      };

    case actionType.DATABASE_DELETE_COLLECTION_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        error: null,
        message: payload,
      };

    case actionType.DATABASE_DELETE_COLLECTION_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
        message: payload,
      };

    case actionType.DATABASE_DELETE_ALL_COLLECTION_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
        message: '',
      };

    case actionType.DATABASE_DELETE_ALL_COLLECTION_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        error: null,
        message: payload,
      };

    case actionType.DATABASE_DELETE_ALL_COLLECTION_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        status: false,
        error: payload,
        message: payload,
      };

    default:
      return state;
  }
};

export default settingsReducer;
