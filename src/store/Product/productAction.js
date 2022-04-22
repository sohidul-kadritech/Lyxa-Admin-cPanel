import { toast } from "react-toastify";
import { ADD_PRODUCT } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// ADD

export const addProduct = (values) => async (dispatch) => {
    console.log({ values });
    try {
      dispatch({
        type: actionType.ADD_PRODUCT_REQUEST_SEND,
      });
  
      const { data } = await requestApi().request(ADD_PRODUCT, {
        method: "POST",
        data: values,
      });
  
      console.log({ data });
  
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
          type: actionType.ADD_PRODUCT_REQUEST_SUCCESS,
          payload: data.data.category,
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
          type: actionType.ADD_PRODUCT_REQUEST_FAIL,
          payload: data.message,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.ADD_PRODUCT_REQUEST_FAIL,
        payload: error.message,
      });
    }
  };