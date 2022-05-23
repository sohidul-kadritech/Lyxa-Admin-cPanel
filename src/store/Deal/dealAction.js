import { toast } from 'react-toastify';
import { ADD_DEAL, DELETE_DEAL, EDIT_DEAL, GET_ALL_DEAL } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionType from '../actionType';

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

  // GET ALL

  export const getAllDeal = (refresh = false) => async (dispatch,getState) => {
    const {deals} = getState().dealReducer;

    if(deals.length < 1 || refresh) {

      try {
        dispatch({
          type: actionType.ALL_DEAL_REQUEST_SEND,
        });
        const { data } = await requestApi().request(GET_ALL_DEAL);
    
        console.log({ data });
    
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
    console.log({ values });
    try {
      dispatch({
        type: actionType.EDIT_DEAL_REQUEST_SEND,
      });
      const { data } = await requestApi().request(EDIT_DEAL, {
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
  
        setTimeout(()=>{
          dispatch({
            type: actionType.EDIT_DEAL_REQUEST_SUCCESS,
            payload: data.data.deal,
          });
        },450)
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
            type: actionType.DELETE_DEAL_REQUEST_SUCCESS,
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