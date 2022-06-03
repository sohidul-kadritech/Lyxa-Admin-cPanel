import { toast } from "react-toastify";
import { GET_DELIVERY_FEE, SET_DELIVERY_FEE } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionTypes from "../actionType";

// ADD DELIVERY CHARGE

export const addDeliveryCharge = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.ADD_DELIVERY_FEE_REQUEST_SEND,
    });

    const { data } = await requestApi().request(SET_DELIVERY_FEE, {
      method: "POST",
      data: values,
    });

    console.log({ data: data });

    if (data.status) {
      toast.success(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch({
        type: actionTypes.ADD_DELIVERY_FEE_REQUEST_SUCCESS,
      });
    } else {
      toast.warn(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      dispatch({
        type: actionTypes.ADD_DELIVERY_FEE_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.ADD_DELIVERY_FEE_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET DELIVERY FEE 

export const getDeliveryCharge = (refresh = false) => async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.GET_DELIVERY_FEE_REQUEST_SEND,
      });
  
      const { data } = await requestApi().request(GET_DELIVERY_FEE);
  
      console.log({ data: data });
  
      if (data.status) {

        
        dispatch({
          type: actionTypes.GET_DELIVERY_FEE_REQUEST_SUCCESS,
          payload: data.data
        });
      } else {
        dispatch({
          type: actionTypes.GET_DELIVERY_FEE_REQUEST_FAIL,
          payload: data.error,
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_DELIVERY_FEE_REQUEST_FAIL,
        payload: error.message,
      });
    }
  };
  
