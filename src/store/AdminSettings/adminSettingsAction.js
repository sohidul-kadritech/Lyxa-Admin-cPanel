import { toast } from "react-toastify";
import { ADD_CUISINE } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

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

    console.log({data})

    if (status) {
      toast.warn(message, {
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
        type: actionType.ADD_CUISINE_REQUEST_SUCCESS,
        payload: data.cuisines,
      });
    } else {
      toast.warn(error, {
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
