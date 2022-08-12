import { successMsg } from "../../helpers/successMsg";
import {
  ADD_DEAL,
  ALL_DEAL_FOR_ADD,
  ALL_TAG,
  DELETE_DEAL,
  EDIT_DEAL,
  GET_ALL_DEAL,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// ADD

export const addDeal = (values) => async (dispatch) => {
  console.log({ values });
  try {
    dispatch({
      type: actionType.ADD_DEAL_REQUEST_SEND,
    });
    const { data } = await requestApi().request(ADD_DEAL, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.ADD_DEAL_REQUEST_SUCCESS,
        payload: data.data.deal,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.ADD_DEAL_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    successMsg(error.message, "error");
    dispatch({
      type: actionType.ADD_DEAL_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL

export const getAllDeal =
  (refresh = false) =>
  async (dispatch, getState) => {
    const { deals, type } = getState().dealReducer;

    if (deals.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.ALL_DEAL_REQUEST_SEND,
        });
        const { data } = await requestApi().request(GET_ALL_DEAL, {
          params: {
            type,
          },
        });

        if (data.status) {
          dispatch({
            type: actionType.ALL_DEAL_REQUEST_SUCCESS,
            payload: data.data.deals,
          });
        } else {
          dispatch({
            type: actionType.ALL_DEAL_REQUEST_FAIL,
            payload: data.error,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.ALL_DEAL_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// EDIT

export const editDeal = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.EDIT_DEAL_REQUEST_SEND,
    });
    const { data } = await requestApi().request(EDIT_DEAL, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      successMsg(data.message, "success");
      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_DEAL_REQUEST_SUCCESS,
          payload: data.data.deal,
        });
      }, 450);
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionType.EDIT_DEAL_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_DEAL_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// DELETE

export const deleteDeal = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.DELETE_DEAL_REQUEST_SEND,
    });
    const { data } = await requestApi().request(DELETE_DEAL, {
      method: "POST",
      data: id,
    });

    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.DELETE_DEAL_REQUEST_SUCCESS,
        payload: data.data.deal,
      });
    } else {
      successMsg(data.error, "error");
      dispatch({
        type: actionType.DELETE_DEAL_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_DEAL_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL FOR SHOP AND PRODUCCT

export const getAllDealForAdd =
  (type, shopType) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actionType.ALL_DEAL_FOR_ADD_REQUEST_SEND,
      });
      const { data } = await requestApi().request(ALL_DEAL_FOR_ADD, {
        params: {
          type,
          shopType: shopType === "food" ? "restaurant" : shopType,
        },
      });

      if (data.status) {
        dispatch({
          type: actionType.ALL_DEAL_FOR_ADD_REQUEST_SUCCESS,
          payload: data.data.deals,
        });
      } else {
        dispatch({
          type: actionType.ALL_DEAL_FOR_ADD_REQUEST_FAIL,
          payload: data.error,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.ALL_DEAL_FOR_ADD_REQUEST_FAIL,
        payload: error.message,
      });
    }
  };

// FILTER UPDATE

export const updateShopFilter = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_DEAL_TYPE_KEY,
    payload: value,
  });
};

// GET ALL TAGS

export const getAllTags = (type) => async (dispatch, getState) => {
  const { tagSearchKey } = getState().dealReducer;
  try {
    dispatch({
      type: actionType.ALL_TAG_REQUEST_SEND,
    });
    const { data } = await requestApi().request(ALL_TAG, {
      params: {
        page: 1,
        pageSize: 100,
        searchKey: tagSearchKey,
        type: "food",
      },
    });

    console.log(data);

    if (data.status) {
      dispatch({
        type: actionType.ALL_TAG_REQUEST_SUCCESS,
        payload: data.data.tags,
      });
    } else {
      dispatch({
        type: actionType.ALL_TAG_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ALL_TAG_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const updateTagsSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_TAG_SEARCH_KEY,
    payload: value,
  });
};
