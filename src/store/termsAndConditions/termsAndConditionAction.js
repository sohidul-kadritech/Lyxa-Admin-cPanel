import { successMsg } from "../../helpers/successMsg";
import { GET_CONDITION, UPDATE_CONDITION } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import {
  GET_TERMS_CONDITION_REQUEST_FAIL,
  GET_TERMS_CONDITION_REQUEST_SEND,
  GET_TERMS_CONDITION_REQUEST_SUCCESS,
  UPDATE_TERMS_CONDITION_REQUEST_FAIL,
  UPDATE_TERMS_CONDITION_REQUEST_SEND,
  UPDATE_TERMS_CONDITION_REQUEST_SUCCESS,
} from "../actionType";

export const updateTermAndCondition =
  (type, description) => async (dispatch) => {
    try {
      dispatch({
        type: UPDATE_TERMS_CONDITION_REQUEST_SEND,
      });

      const {
        data: { status, error, message, data },
      } = await requestApi().request(UPDATE_CONDITION, {
        method: "POST",
        data: {
          type,
          description,
        },
      });

      if (status) {
        successMsg(message, "success");
        dispatch({
          type: UPDATE_TERMS_CONDITION_REQUEST_SUCCESS,
          payload: data,
        });
      } else {
        successMsg(message, "error");
        dispatch({
          type: UPDATE_TERMS_CONDITION_REQUEST_FAIL,
          payload: error,
        });
      }
    } catch (e) {}
  };

//   GET TERMS AND CONDITIONS

export const getTermAndCondition = (type) => async (dispatch) => {
  try {
    dispatch({
      type: GET_TERMS_CONDITION_REQUEST_SEND,
    });

    const {
      data: { status, error, message, data },
    } = await requestApi().request(GET_CONDITION, {
      params: {
        type,
      },
    });

    if (status) {
      successMsg(message, "success");
      dispatch({
        type: GET_TERMS_CONDITION_REQUEST_SUCCESS,
        payload: data,
      });
    } else {
      successMsg(message, "error");
      dispatch({
        type: GET_TERMS_CONDITION_REQUEST_FAIL,
        payload: error,
      });
    }
  } catch (e) {}
};
