import { toast } from 'react-toastify';
import { ADD_DEAL } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionType from '../actionType';

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
  
      console.log({ data });
  
      if (data.status) {
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
          type: actionType.ADD_DEAL_REQUEST_SUCCESS,
          payload: data.data.deal,
        });
      } else {
        toast.warn(data.error, {
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
          type: actionType.ADD_DEAL_REQUEST_FAIL,
          payload: data.error,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.ADD_DEAL_REQUEST_FAIL,
        payload: error.message,
      });
    }
  };