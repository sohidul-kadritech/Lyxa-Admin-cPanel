import { successMsg } from '../../helpers/successMsg';
import { ADD_UNIT, DELETE_UNIT, EDIT_UNIT, GET_ALL_UNIT } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionType from '../actionType';

// ADD UNIT
export const addUnitType = (name) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_UNIT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_UNIT, {
      method: 'POST',
      data: {
        name,
      },
    });

    if (data.status) {
      successMsg(data.message, 'success');
      dispatch({
        type: actionType.ADD_UNIT_REQUEST_SUCCESS,
        payload: data.data,
      });
    } else {
      successMsg(data.message, 'error');
      dispatch({
        type: actionType.ADD_UNIT_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    successMsg(error.message, 'error');
    dispatch({
      type: actionType.ADD_UNIT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL UNIT
export const getAllUnitType =
  (refresh = false) =>
  async (dispatch, getState) => {
    const { unitTypes } = getState().unitTypeReducer;

    if (unitTypes.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.GET_ALL_UNIT_REQUEST_SEND,
        });

        const { data } = await requestApi().request(GET_ALL_UNIT);

        if (data.status) {
          dispatch({
            type: actionType.GET_ALL_UNIT_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          successMsg(data.message, 'error');
          dispatch({
            type: actionType.GET_ALL_UNIT_REQUEST_FAIL,
            payload: data.message,
          });
        }
      } catch (error) {
        successMsg(error.message, 'error');
        dispatch({
          type: actionType.GET_ALL_UNIT_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

//   EDIT UNIT TYPE
export const editUnitType = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.EDIT_UNIT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(EDIT_UNIT, {
      method: 'POST',
      data: values,
    });

    if (data.status) {
      successMsg(data.message, 'success');
      dispatch({
        type: actionType.EDIT_UNIT_REQUEST_SUCCESS,
        payload: data.data,
      });
    } else {
      successMsg(data.message, 'error');
      dispatch({
        type: actionType.EDIT_UNIT_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    successMsg(error.message, 'error');
    dispatch({
      type: actionType.EDIT_UNIT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

//  DELETE UNIT TYPE
export const deleteUnitType = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.DELETE_UNIT_REQUEST_SEND,
    });

    const { data } = await requestApi().request(DELETE_UNIT, {
      method: 'POST',
      data: {
        id,
      },
    });

    if (data.status) {
      successMsg(data.message, 'success');
      dispatch({
        type: actionType.DELETE_UNIT_REQUEST_SUCCESS,
        payload: id,
      });
    } else {
      successMsg(data.message, 'error');
      dispatch({
        type: actionType.DELETE_UNIT_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    successMsg(error.message, 'error');
    dispatch({
      type: actionType.DELETE_UNIT_REQUEST_FAIL,
      payload: error.message,
    });
  }
};
