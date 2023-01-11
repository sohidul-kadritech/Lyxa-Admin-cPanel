import { successMsg } from "../../helpers/successMsg";
import {
  ADD_DEFAULT_CHAT,
  ADD_ORDER_CANCEL_REASON,
  ADMINS_SETTINGS,
  ADMIN_LOGS_HISTORY,
  ALL_ORDER_CANCEL_REASON,
  APP_SETTINGS,
  DELETE_SELLER_SPECIAL_DROP_CHARGE,
  EDIT_DEFAULT_CHAT,
  GET_DEFAULT_CHAT,
  GET_DELIVERY_FEE,
  GET_SPECIAL_DROP_CHARGE,
  SET_DELIVERY_FEE,
  UPDATE_ADMINS_SETTINGS,
  UPDATE_APP_SETTINGS,
  UPDATE_DELIVERY_CUT,
  UPDATE_ORDER_CANCEL_REASON,
  DATABASE_ALL_COLLECTIONS,
  DATABASE_COLLECTION_BACKUP,
  DATABASE_RESTORE_LAST_COLLECTION_BACKUP,
  DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// UPDATE GOOGLE MAP KEY
export const updateGoogleMapApiKey = (key) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_GOOGLE_KEY,
    payload: key,
  });
};

// UPDATE DELIVERY FEE PER/KM
export const updateDeliveryFee = (fee) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_DELIVERY_FEE,
    payload: fee,
  });
};

// SEARCH DELIVERY BOY DISTANCE KM
export const updateSearchDeliveryBoyKm = (km) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SEARCH_DELIVERY_BOY_KM,
    payload: km,
  });
};

export const removeSearchDeliveryBoyKm = (index) => (dispatch) => {
  dispatch({
    type: actionType.REMOVE_SEARCH_DELIVERY_BOY_KM,
    payload: index,
  });
};

// GET ALL ADMIN SETTINGS VALUE

export const getAllAdminSettings = () => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ALL_ADMIN_SETTINGS_REQUEST_SEND,
    });

    const {
      data: { status, error, data },
    } = await requestApi().request(ADMINS_SETTINGS);

    if (status) {
      dispatch({
        type: actionType.ALL_ADMIN_SETTINGS_REQUEST_SUCCESS,
        payload: data.adminSetting,
      });
    } else {
      dispatch({
        type: actionType.ALL_ADMIN_SETTINGS_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ALL_ADMIN_SETTINGS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// UPDATE ADMIN SETTINGS

export const updateAdminSettings = () => async (dispatch, getState) => {
  const { googleMapKey, deliveryFeePerKm, searchDeliveryBoyKm } =
    getState().settingsReducer;

  try {
    dispatch({
      type: actionType.UPDATE_ADMIN_SETTINGS_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data },
    } = await requestApi().request(UPDATE_ADMINS_SETTINGS, {
      method: "POST",
      data: {
        googleApiKey: googleMapKey,
        deliveryFeePerKm,
        searchDeliveryBoyKm,
      },
    });

    if (status) {
      successMsg(message, "success");
      dispatch({
        type: actionType.UPDATE_ADMIN_SETTINGS_REQUEST_SUCCESS,
        payload: data.adminSetting,
      });
    } else {
      successMsg(message, "error");
      dispatch({
        type: actionType.UPDATE_ADMIN_SETTINGS_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.UPDATE_ADMIN_SETTINGS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// UPDATE NEAR SHOP DISTANCE KEY

export const updateNearByShopKey = (distance) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_NEAR_BY_SHOP,
    payload: distance,
  });
};

// MAX DISCOUNT AMOUTN UPDATE

export const updateMaxDiscount = (amount) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_MAX_DISCOUNT,
    payload: amount,
  });
};

// UPDATE DROP  CREDIT

export const updateDropCreditLimit = (amount) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_DROP_CREDIT_LIMIT,
    payload: amount,
  });
};

// UPDATE CURRENCY

export const updateCurrency = (currency) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_DROP_CURRENCY,
    payload: currency,
  });
};

// UPDATE APP SETTINGS

export const updateAppSettings = (type) => async (dispatch, getState) => {
  const { appSettingsOptions } = getState().settingsReducer;
  try {
    dispatch({
      type: actionType.UPDATE_APP_SETTINGS_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data },
    } = await requestApi().request(UPDATE_APP_SETTINGS, {
      method: "POST",
      data: {
        // nearByShopKm: appSettingsOptions.nearByShopKm,
        // maxDiscount: appSettingsOptions.maxDiscount,
        // searchDeliveryBoyKm: appSettingsOptions.searchDeliveryBoyKm,
        // maxCustomerServiceValue: appSettingsOptions.maxCustomerServiceValue,
        ...appSettingsOptions,
        type,
      },
    });

    if (status) {
      successMsg(message, "success");
      dispatch({
        type: actionType.UPDATE_APP_SETTINGS_REQUEST_SUCCESS,
        payload: data.appSetting,
      });
    } else {
      successMsg(message, "error");
      dispatch({
        type: actionType.UPDATE_APP_SETTINGS_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.UPDATE_APP_SETTINGS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL APP SETTINGS

export const getAllAppSettings = () => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ALL_APP_SETTINGS_REQUEST_SEND,
    });

    const {
      data: { status, error, data },
    } = await requestApi().request(APP_SETTINGS);

    if (status) {
      dispatch({
        type: actionType.ALL_APP_SETTINGS_REQUEST_SUCCESS,
        payload: data.appSetting,
      });
    } else {
      dispatch({
        type: actionType.ALL_APP_SETTINGS_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ALL_APP_SETTINGS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// ADD PERCENTAGE SETTING

export const addPercentage = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_DELIVERY_FEE_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SET_DELIVERY_FEE, {
      method: "POST",
      data: values,
    });

    console.log({ data });

    if (data.status) {
      const { charge } = data?.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_DELIVERY_FEE_REQUEST_SUCCESS,
        payload: charge,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_DELIVERY_FEE_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_DELIVERY_FEE_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET PERCENTAGE SETTINGS

export const getPercentageSetting = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: actionType.GET_PERCENTAGE_REQUEST_SEND,
    });

    const {
      data: { status, error, data },
    } = await requestApi().request(GET_DELIVERY_FEE);

    if (status) {
      dispatch({
        type: actionType.GET_PERCENTAGE_REQUEST_SUCCESS,
        payload: data?.charge,
      });
    } else {
      dispatch({
        type: actionType.GET_PERCENTAGE_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.GET_PERCENTAGE_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const updateDeliveryCut = (deliveryRange) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.UPDATE_DELIVERY_CUT_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data },
    } = await requestApi().request(UPDATE_DELIVERY_CUT, {
      method: "POST",
      data: {
        deliveryRange,
      },
    });

    if (status) {
      successMsg(message, "success");
      dispatch({
        type: actionType.UPDATE_DELIVERY_CUT_REQUEST_SUCCESS,
        payload: data.charge,
      });
    } else {
      successMsg(message, "error");
      dispatch({
        type: actionType.UPDATE_DELIVERY_CUT_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    successMsg(error.message, "error");
    dispatch({
      type: actionType.UPDATE_DELIVERY_CUT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// ADD CANCELATION REASON

export const addCancelReason = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_REASON_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_ORDER_CANCEL_REASON, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      const { cancelReason } = data.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_REASON_REQUEST_SUCCESS,
        payload: cancelReason,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_REASON_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    successMsg(error.message, "error");
    dispatch({
      type: actionType.ADD_REASON_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// UPDATE CANCEL REASON

export const updateCancelReason = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.UPDATE_REASON_REQUEST_SEND,
    });

    const { data } = await requestApi().request(UPDATE_ORDER_CANCEL_REASON, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      const { cancelReason } = data.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.UPDATE_REASON_REQUEST_SUCCESS,
        payload: cancelReason,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.UPDATE_REASON_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.UPDATE_REASON_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL CANCEL REASONS

export const getAllCancelReasons =
  (refresh = false, adminType = null) =>
  async (dispatch, getState) => {
    const { cancelReasons, typeKey, activeStatus } = getState().settingsReducer;

    if (refresh || cancelReasons.length > 1) {
      try {
        dispatch({
          type: actionType.ALL_REASONS_REQUEST_SEND,
        });

        const {
          data: { status, error, data },
        } = await requestApi().request(ALL_ORDER_CANCEL_REASON, {
          params: {
            type: adminType ?? typeKey,
            status: activeStatus,
          },
        });

        console.log({ data });

        if (status) {
          dispatch({
            type: actionType.ALL_REASONS_REQUEST_SUCCESS,
            payload: data.cancelReason,
          });
        } else {
          dispatch({
            type: actionType.ALL_REASONS_REQUEST_FAIL,
            payload: error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.ALL_REASONS_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// CANCEL REASON TYPE UPDATE

export const updateReasonTypeKey = (type) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_REASON_TYPE_KEY,
    payload: type,
  });
};

// CANCEL REASON STATUS UPDATE

export const updateReasonStatusKey = (status) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_REASON_STATUS_KEY,
    payload: status,
  });
};

//GET  SELLERS WHO HAS SPECIAL DROP CHARGE

export const getSellerSpecialDropCharge = (page) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.SELLERS_SPECIAL_DROP_CHARGE_REQUEST_SEND,
    });

    const {
      data: { status, error, data },
    } = await requestApi().request(GET_SPECIAL_DROP_CHARGE, {
      params: {
        page,
        pageSize: 50,
      },
    });

    if (status) {
      dispatch({
        type: actionType.SELLERS_SPECIAL_DROP_CHARGE_REQUEST_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: actionType.SELLERS_SPECIAL_DROP_CHARGE_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.SELLERS_SPECIAL_DROP_CHARGE_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// DELETE SELLER SPECIAL CHARGE

export const deleteSellerSpecialDropCharge = (sellerId) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.DELETE_SELLER_DROP_CHARGE_REQUEST_SEND,
    });

    const { data } = await requestApi().request(
      DELETE_SELLER_SPECIAL_DROP_CHARGE,
      {
        method: "POST",
        data: {
          sellerId,
        },
      }
    );

    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.DELETE_SELLER_DROP_CHARGE_REQUEST_SUCCESS,
        payload: sellerId,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.DELETE_SELLER_DROP_CHARGE_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_SELLER_DROP_CHARGE_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL ADMIN LOG HISTORY

export const getAdminLogHistory =
  (refresh = false, page = 1) =>
  async (dispatch, getState) => {
    const { adminLogType, logSortBy, adminLogs } = getState().settingsReducer;

    if (adminLogs.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.ALL_AMDIN_LOGS_REQUEST_SEND,
        });

        const {
          data: { status, error, data },
        } = await requestApi().request(ADMIN_LOGS_HISTORY, {
          params: {
            type: adminLogType.value,
            sortBy: logSortBy.value,
            page,
            pageSize: 50,
          },
        });

        if (status) {
          dispatch({
            type: actionType.ALL_AMDIN_LOGS_REQUEST_SUCCESS,
            payload: data,
          });
        } else {
          dispatch({
            type: actionType.ALL_AMDIN_LOGS_REQUEST_FAIL,
            payload: error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.ALL_AMDIN_LOGS_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// ADMIN LOG HISTORY FILTER

export const updateAdminLogTypeKey = (type) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ADMIN_LOG_TYPE_KEY,
    payload: type,
  });
};

export const updateAdminLogSortKey = (key) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_ADMIN_SORT_KEY,
    payload: key,
  });
};

// DEFAULT CHAT MESSAGE

export const getDefaultMessage = (refresh) => async (dispatch, getState) => {
  const { defualtMessages, searchKey } = getState().settingsReducer;

  if (defualtMessages > 1 || refresh) {
    try {
      dispatch({
        type: actionType.ALL_DEFAULT_CHAT_REQUEST_SEND,
      });

      const {
        data: { status, error, data },
      } = await requestApi().request(GET_DEFAULT_CHAT, {
        params: {
          search: searchKey,
        },
      });

      if (status) {
        dispatch({
          type: actionType.ALL_DEFAULT_CHAT_REQUEST_SUCCESS,
          payload: data?.messages,
        });
      } else {
        dispatch({
          type: actionType.ALL_DEFAULT_CHAT_REQUEST_FAIL,
          payload: error,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.ALL_DEFAULT_CHAT_REQUEST_FAIL,
        payload: error.message,
      });
    }
  }
};

export const addDefaultMsg = (msg) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_DEFAULT_CHAT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_DEFAULT_CHAT, {
      method: "POST",
      data: {
        message: msg,
      },
    });

    if (data.status) {
      const { message } = data?.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_DEFAULT_CHAT_REQUEST_SUCCESS,
        payload: message,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_DEFAULT_CHAT_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_DEFAULT_CHAT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const editDefaultMsg = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.EDIT_DEFAULT_CHAT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(EDIT_DEFAULT_CHAT, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      const { message } = data?.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.EDIT_DEFAULT_CHAT_REQUEST_SUCCESS,
        payload: message,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.EDIT_DEFAULT_CHAT_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    successMsg(error.message, "error");
    dispatch({
      type: actionType.EDIT_DEFAULT_CHAT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const updateDefaultSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_DEFAULT_MESSAGE_SEARCH_KEY,
    payload: value,
  });
};

// DATABASE
export const getAllDatabaseCollections = () => async (dispatch) => {
  try{
    dispatch({
      type: actionType.ALL_DATABASE_COLLECTIONS_REQUEST_SEND
    })
  
    const {data: resData} = await requestApi().request(DATABASE_ALL_COLLECTIONS, {});
    const {data, success, error} = resData;
    

    if(success){
      dispatch({
        type: actionType.ALL_DATABASE_COLLECTIONS_REQUEST_SUCCESS,
        payload: data?.tables
      })

    }else{
      dispatch({
        type: actionType.ALL_DATABASE_COLLECTIONS_REQUEST_FAIL,
        payload: error
      })
    }

  }catch(error){
    dispatch({
      type: actionType.ALL_DATABASE_COLLECTIONS_REQUEST_FAIL,
      payload: error.message
    })
  }
}

export const createDatabaseCollectionBackup = (collections) => async (dispatch) => {
  try{
    dispatch({
      type: actionType.DATABASE_COLLECTION_BACKUP_REQUEST_SEND
    })

    const {data} = await requestApi().request(DATABASE_COLLECTION_BACKUP, {method: 'POST', data: { collections }});
    const {success, message, error} = data;

    if(success){
      dispatch({
        type: actionType.DATABASE_COLLECTION_BACKUP_REQUEST_SUCCESS,
        payload: message
      })

      successMsg(message, 'success');

      // refresh the DB collection
      dispatch(getAllDatabaseCollections());

    }else{
      dispatch({
        type: actionType.DATABASE_COLLECTION_BACKUP_REQUEST_FAIL,
        payload: error,
      })

      successMsg("Backup Failed", 'failure');
    }

  }catch(error){
    dispatch({
      type: actionType.DATABASE_COLLECTION_BACKUP_REQUEST_FAIL,
      payload: error?.message
    })

    console.log(error)
    successMsg("Backup Failed", 'failure');
  }
}

export const restoreCollectionLastBackup = (collectionName) => async (dispatch) => {
  try{
    dispatch({
      type: actionType.DATABASE_RESTORE_LAST_COLLECTION_BACKUP_REQUEST_SEND
    })

    const {data} = await requestApi().request(DATABASE_RESTORE_LAST_COLLECTION_BACKUP, {method: 'POST', data: { collectionName }});
    const {success, message, error} = data;

    if(success){
      dispatch({
        type: actionType.DATABASE_COLLECTION_BACKUP_REQUEST_SUCCESS,
        payload: message
      })

      successMsg(message, 'success');

      // refresh the DB collection
      dispatch(getAllDatabaseCollections());

    }else{
      dispatch({
        type: actionType.DATABASE_RESTORE_LAST_COLLECTION_BACKUP_REQUEST_FAIL,
        payload: error,
      })

      successMsg("Backup Failed", 'failure');
    }

  }catch(error){
    dispatch({
      type: actionType.DATABASE_RESTORE_LAST_COLLECTION_BACKUP_REQUEST_FAIL,
      payload: error?.message
    })

    console.log(error)
    successMsg("Backup Failed", 'failure');
  }
}

export const restoreAllCollectionsLastBackup = () => async (dispatch) => {
  try{
    dispatch({
      type: actionType.DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP_REQUEST_SEND
    })

    const {data} = await requestApi().request(DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP);
    const {success, message, error} = data;

    if(success){
      dispatch({
        type: actionType.DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP_REQUEST_SUCCESS,
        payload: message
      })

      successMsg(message, 'success');

      // refresh the DB collection
      dispatch(getAllDatabaseCollections());

    }else{
      dispatch({
        type: actionType.DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP_REQUEST_FAIL,
        payload: error,
      })

      successMsg("Backup Failed", 'failure');
    }

  }catch(error){
    dispatch({
      type: actionType.DATABASE_RESTORE_ALL_COLLECTIONS_LAST_BACKUP_REQUEST_FAIL,
      payload: error?.message
    })

    console.log(error)
    successMsg("Backup Failed", 'failure');
  }
}
