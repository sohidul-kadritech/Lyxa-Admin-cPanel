/* eslint-disable default-param-last */
import { successMsg } from '../../helpers/successMsg';
import {
  ADD_CATEGORY,
  ADD_SUB_CATEGORY,
  DELETE_SUB_CATEGORY,
  EDIT_CATEGORY,
  EDIT_SUB_CATEGORY,
  GET_ALL_CATEGORY,
  GET_ALL_SUB_CATEGORY,
} from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionType from '../actionType';

// ADD CATEGORY

export const addCategory = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_CATEGORY_REQUEST_SEND,
    });

    const { data } = await requestApi().request(`${ADD_CATEGORY}?userType=${values.userType}`, {
      method: 'POST',
      data: values,
    });

    if (data.status) {
      successMsg(data.message, 'success');
      dispatch({
        type: actionType.ADD_CATEGORY_REQUEST_SUCCESS,
        payload: data.data.category,
      });
    } else {
      successMsg(data.message, 'error');
      dispatch({
        type: actionType.ADD_CATEGORY_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    successMsg(error.message, 'error');
    dispatch({
      type: actionType.ADD_CATEGORY_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const getAllCategory =
  (refresh = false, userType, page = 1) =>
  async (dispatch, getState) => {
    const { categories, shopType } = getState().categoryReducer;

    if (categories.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.GET_ALL_CATEGORY_REQUEST_SEND,
        });

        const { data } = await requestApi().request(GET_ALL_CATEGORY, {
          params: {
            page,
            pageSize: 30,
            type: shopType,
            userType,
          },
        });

        if (data.status) {
          dispatch({
            type: actionType.GET_ALL_CATEGORY_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionType.GET_ALL_CATEGORY_REQUEST_FAIL,
            payload: data.message,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.GET_ALL_CATEGORY_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

//   EDIT

export const editCategory = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.EDIT_CATEGORY_REQUEST_SEND,
    });

    const { data } = await requestApi().request(EDIT_CATEGORY, {
      method: 'POST',
      data: values,
    });

    if (data.status) {
      successMsg(data.message, 'success');

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_CATEGORY_REQUEST_SUCCESS,
          payload: data.data.category,
        });
      }, 400);
    } else {
      successMsg(data.message, 'error');

      dispatch({
        type: actionType.EDIT_CATEGORY_REQUEST_FAIL,
        paylaod: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_CATEGORY_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};

// SET STATUS FALSE

export const setCatStatusFalse = () => (dispatch) => {
  dispatch({
    type: actionType.SET_STATUS_FALSE,
  });
};

// ADD SUB CATGEGORY

export const addSubCategory = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_SUB_CATEGORY_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_SUB_CATEGORY, {
      method: 'POST',
      data: values,
    });

    if (data.status) {
      successMsg(data.message, 'success');
      dispatch({
        type: actionType.ADD_SUB_CATEGORY_REQUEST_SUCCESS,
        payload: data.data.addSubCategory,
      });
    } else {
      successMsg(data.message, 'error');
      dispatch({
        type: actionType.ADD_SUB_CATEGORY_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_SUB_CATEGORY_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL SUB CATEGORY BY CATEGORY

export const getAllSubCategory =
  (refresh = false, CatId, page = 1) =>
  async (dispatch, getState) => {
    const { subCategories, subStatusKey, subSearchKey } = getState().categoryReducer;

    if (subCategories.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.GET_ALL_SUB_CATEGORY_REQUEST_SEND,
        });

        const { data } = await requestApi().request(GET_ALL_SUB_CATEGORY, {
          params: {
            categoryId: CatId,
            page,
            pageSize: 10,
            searchKey: subSearchKey,
            status: subStatusKey.value,
          },
        });

        if (data.status) {
          dispatch({
            type: actionType.GET_ALL_SUB_CATEGORY_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionType.GET_ALL_SUB_CATEGORY_REQUEST_FAIL,
            payload: data.message,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.GET_ALL_SUB_CATEGORY_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

// EDIT SUB CATEGORY

export const editSubCategory = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.EDIT_SUB_CATEGORY_REQUEST_SEND,
    });

    const { data } = await requestApi().request(EDIT_SUB_CATEGORY, {
      method: 'POST',
      data: values,
    });

    if (data.status) {
      successMsg(data.message, 'success');

      dispatch({
        type: actionType.EDIT_SUB_CATEGORY_REQUEST_SUCCESS,
        payload: data.data.category,
      });
    } else {
      successMsg(data.message, 'error');

      dispatch({
        type: actionType.EDIT_SUB_CATEGORY_REQUEST_FAIL,
        paylaod: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_SUB_CATEGORY_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};

//   DELETE

export const deleteSubCategory = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.DELETE_SUB_CATEGORY_REQUEST_SEND,
    });
    const { data } = await requestApi().request(DELETE_SUB_CATEGORY, {
      method: 'POST',
      data: { id },
    });

    if (data.status) {
      successMsg(data.message, 'success');

      dispatch({
        type: actionType.DELETE_SUB_CATEGORY_REQUEST_SUCCESS,
        payload: data.data.subCategory,
      });
    } else {
      successMsg(data.message, 'error');
      dispatch({
        type: actionType.DELETE_SUB_CATEGORY_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_SUB_CATEGORY_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

export const updateSubCatSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SEARCH_KEY,
    payload: value,
  });
};

// UPDATE STATUS KEY

export const updateSubCatStatusKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_STATUS_KEY,
    payload: value,
  });
};

// UPDTAE CATEGORY  TYPE KEY

export const updateCategoryShopType = (selectedType) => (dispatch) => {
  dispatch({
    type: actionType.UPTATE_CATEGORY_SHOP_TYEP_KEY,
    payload: selectedType,
  });
};
