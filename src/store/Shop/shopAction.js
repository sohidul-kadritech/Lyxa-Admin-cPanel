import * as actionType from "../actionType";
import { toast } from "react-toastify";
import requestApi from "../../network/httpRequest";
import {
  ADD_CUISINE,
  ADD_SHOP,
  ADD_SHOP_DEAL,
  ALL_CUISINE,
  ALL_SHOP,
  DELETE_SHOP,
  DELETE_SHOP_DEAL,
  EDIT_CUISINE,
  EDIT_SHOP,
  SET_AS_FEATURED,
  SHOP_LIVE_STATUS,
  UPDATE_SHOP_STATUS,
} from "../../network/Api";
import { successMsg } from "../../helpers/successMsg";

// ADD
export const addShop = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_SHOP_REQUEST_SEND,
    });
    const { data } = await requestApi().request(ADD_SHOP, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.ADD_SHOP_REQUEST_SUCCESS,
        payload: data.data.shop,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_SHOP_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    successMsg(error.message, "error");
    dispatch({
      type: actionType.ADD_SHOP_REQUEST_FAIL,
      payload: error,
    });
  }
};

// GET ALL

export const getAllShop =
  (refresh = false, seller = null, page = 1) =>
    async (dispatch, getState) => {
      const { shops, searchKey, statusKey, typeKey, sortByKey, liveStatus } =
        getState().shopReducer;

      if (shops.length < 1 || refresh) {
        try {
          dispatch({
            type: actionType.GET_ALL_SHOP_REQUEST_SEND,
          });

          const { data } = await requestApi().request(ALL_SHOP, {
            params: {
              page: page,
              pageSize: 40,
              sortBy: sortByKey.value,
              searchKey,
              type: typeKey.value ? typeKey.value : typeKey,
              shopStatus: statusKey.value,
              liveStatus: liveStatus.value,
              sellerId: seller,
            },
          });



          if (data.status) {
            dispatch({
              type: actionType.GET_ALL_SHOP_REQUEST_SUCCESS,
              payload: data.data,
            });
          } else {
            dispatch({
              type: actionType.GET_ALL_SHOP_REQUEST_FAIL,
              payload: data.message,
            });
          }
        } catch (error) {
          dispatch({
            type: actionType.GET_ALL_SHOP_REQUEST_FAIL,
            payload: error.message,
          });
        }
      }
    };

// EDIT

export const editShop = (values) => async (dispatch) => {
  // console.log({ values });
  try {
    dispatch({
      type: actionType.EDIT_SHOP_REQUEST_SEND,
    });
    const { data } = await requestApi().request(EDIT_SHOP, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      successMsg(data.message, "success");

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_SHOP_REQUEST_SUCCESS,
          payload: data.data.shop,
        });
      }, 400);
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.EDIT_SHOP_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_SHOP_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

//   DELETE

// export const deleteShop = (id) => async (dispatch) => {
//   try {
//     dispatch({
//       type: actionType.DELETE_SHOP_REQUEST_SEND,
//     });
//     const { data } = await requestApi().request(DELETE_SHOP, {
//       method: "POST",
//       data: { id },
//     });

//     if (data.status) {
//       successMsg(data.message, "success");

//       dispatch({
//         type: actionType.DELETE_SHOP_REQUEST_SUCCESS,
//         payload: id,
//       });
//     } else {
//       successMsg(data.message, "error");
//       dispatch({
//         type: actionType.DELETE_SHOP_REQUEST_FAIL,
//         payload: data.message,
//       });
//     }
//   } catch (error) {
//     dispatch({
//       type: actionType.DELETE_SHOP_REQUEST_FAIL,
//       payload: error.message,
//     });
//   }
// };

// ADD PRODUCT DEAL

export const addShopDeal = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_SHOP_DEAL_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_SHOP_DEAL, {
      method: "POST",
      data: values,
    });



    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_SHOP_DEAL_REQUEST_SUCCESS,
        payload: data.data.shop,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.ADD_SHOP_DEAL_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_SHOP_DEAL_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// CHANGE LIVE STATUS
export const ShopLiveStatus = (value) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.SHOP_LIVE_STATUS_REQUEST_SEND,
    });
    const { data } = await requestApi().request(SHOP_LIVE_STATUS, {
      method: "POST",
      data: value,
    });

    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.SHOP_LIVE_STATUS_REQUEST_SUCCESS,
        payload: data.data.shop,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.SHOP_LIVE_STATUS_REQUEST_FAIL,
        payload: data.data.shop,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.SHOP_LIVE_STATUS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// SET STATUS FALSE

export const setShopStatusFalse = () => (dispatch) => {
  dispatch({
    type: actionType.SET_STATUS_FALSE,
  });
};

// UPDATE SEARCH KEY

export const updateShopSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SHOP_SEARCH_KEY,
    payload: value,
  });
};

// UPDATE STATUS KEY

export const updateShopStatusKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SHOP_STATUS_KEY,
    payload: value,
  });
};

// UPDATE SORT BY KEY

export const updateSortByKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SHOP_SORT_BY_KEY,
    payload: value,
  });
};

// type key

export const updateShopType = (selectedType) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SHOP_TYPE_KEY,
    payload: selectedType,
  });
};

export const updateShopLiveStatus = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SHOP_LIVE_STATUS,
    payload: value,
  });
};

// ADD CUISINES

export const addCuisine = (name) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_CUISINE_REQUEST_SEND,
    });

    const {
      data: { status, message, error, data = null },
    } = await requestApi().request(ADD_CUISINE, {
      method: "POST",
      data: { name },
    });

    if (status) {
      successMsg(message, "success");

      dispatch({
        type: actionType.ADD_CUISINE_REQUEST_SUCCESS,
        payload: data.cuisines,
      });
    } else {
      successMsg(error, "error");
      dispatch({
        type: actionType.ADD_CUISINE_REQUEST_FAIL,
        paylaod: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_CUISINE_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};

// SET AS FEATURED SHOP

export const setAsFeaturedShop = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.SET_FEATURED_SHOP_REQUEST_SEND,
    });

    const {
      data: { status, error, message },
    } = await requestApi().request(SET_AS_FEATURED, {
      method: "POST",
      data: values,
    });


    if (status) {
      successMsg(message, "success");
      dispatch({
        type: actionType.SET_FEATURED_SHOP_REQUEST_SUCCESS,
      });
    } else {
      successMsg(error, "error");
      dispatch({
        type: actionType.SET_FEATURED_SHOP_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (error) {
    successMsg(error, "error");
    dispatch({
      type: actionType.SET_FEATURED_SHOP_REQUEST_FAIL,
      payload: error,
    });
  }
};

// GET ALL CUISINES

export const getAllCuisine = (refresh) => async (dispatch, getState) => {
  const { cuisines } = getState().shopReducer;
  if (cuisines.length < 1 || refresh) {
    try {
      dispatch({
        type: actionType.ALL_CUISINES_REQUEST_SEND,
      });

      const {
        data: { status, error, data = null },
      } = await requestApi().request(ALL_CUISINE);

      if (status) {
        dispatch({
          type: actionType.ALL_CUISINES_REQUEST_SUCCESS,
          payload: data.cuisines,
        });
      } else {
        dispatch({
          type: actionType.ALL_CUISINES_REQUEST_FAIL,
          paylaod: error,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.ALL_CUISINES_REQUEST_FAIL,
        paylaod: error.message,
      });
    }
  }
};

// EDIT CUISINE

export const editCuisine = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.EDIT_CUISINE_REQUEST_SEND,
    });

    const {
      data: { status, message, error, data = null },
    } = await requestApi().request(EDIT_CUISINE, {
      method: "POST",
      data: values,
    });

    if (status) {
      successMsg(message, "success");
      dispatch({
        type: actionType.EDIT_CUISINE_REQUEST_SUCCESS,
        payload: data.cuisines,
      });
    } else {
      successMsg(error, "error");
      dispatch({
        type: actionType.EDIT_CUISINE_REQUEST_FAIL,
        paylaod: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_CUISINE_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};

// DELETE DEAL

export const deleteDealOfShop = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.DELETE_SHOP_DEAL_REQUEST_SEND,
    });

    const {
      data: { status, error, data = null },
    } = await requestApi().request(DELETE_SHOP_DEAL, {
      method: "POST",
      data: values,
    });

    if (status) {
      successMsg("Successfully deleted", "success");
      dispatch({
        type: actionType.DELETE_SHOP_DEAL_REQUEST_SUCCESS,
        payload: data.shop,
      });
    } else {
      successMsg(error, "error");
      dispatch({
        type: actionType.DELETE_SHOP_DEAL_REQUEST_FAIL,
        paylaod: error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_SHOP_DEAL_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};

// UPDATE STATUS

export const updateShopStatus = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.UPDATE_SHOP_STATUS_REQUEST_SEND,
    });
    const { data } = await requestApi().request(UPDATE_SHOP_STATUS, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.UPDATE_SHOP_STATUS_REQUEST_SUCCESS,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.UPDATE_SHOP_STATUS_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.UPDATE_SHOP_STATUS_REQUEST_FAIL,
      payload: error.message,
    });
  }
};
