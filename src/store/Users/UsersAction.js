import { toast } from "react-toastify";
import { ADD_USER, ALL_USERS, EDIT_USER } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";
import usersReducer from "./UsersReducer";

// USERS LIST

export const usersList =
  (refresh = false, page = 1) =>
  async (dispatch, getState) => {
    const { users, searchKey, statusKey, createdByKey } =
      getState().usersReducer;

    try {
      if (users.length < 1 || refresh) {
        dispatch({
          type: actionType.GET_ALL_USERS_REQUEST_SEND,
        });

        const { data } = await requestApi().request(ALL_USERS, {
          params: {
            searchKey: searchKey,
            page: page,
            pageSize: 20,
            status: statusKey,
            createdBy: createdByKey,
          },
        });

        // console.log("users-----", data);

        if (data.status) {
          dispatch({
            type: actionType.GET_ALL_USERS_REQUEST_SUCCESS,
            payload: {
              users: data.data.users,
              paginate: data.data.paginate,
            },
          });
        } else {
          dispatch({
            type: actionType.GET_ALL_USERS_REQUEST_FAIL,
            payload: data.error,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: actionType.GET_ALL_USERS_REQUEST_FAIL,
        payload: error.message,
      });
    }
  };

// UPDATE STATUS KEY

export const updateStatusKey = (status) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_USERS_STATUS_KEY,
    payload: status,
  });
};

// UPDATE SEARCH KEY

export const updateSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_USERS_SEARCH_KEY,
    payload: value,
  });
};

// UPDATE CREATED BY KEY

export const updateCreatedByKey = (key) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_USERS_CREATED_BY_KEY,
    payload: key,
  });
};


// ADD USER

export const addUser = (user) => async dispatch => {

  try {
    dispatch({
      type: actionType.ADD_USER_REQUEST_SEND
    })

    const {data} = await requestApi().request(ADD_USER,{
      method: 'POST',
      data: user
    })

    if(data.status){
      toast.success(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });

      dispatch({
        type: actionType.ADD_USER_REQUEST_SUCCESS,
        payload: data.data.user
      })
    }else{
      toast.warn(data.error, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      dispatch({
        type: actionType.ADD_USER_REQUEST_FAIL,
        payload: data.error
      })
    }

  } catch (error) {
    dispatch({
      type: actionType.ADD_USER_REQUEST_FAIL,
      payload: error.message
    })
  }

}

// EDIT USER


export const editUser = (user) => async dispatch => {

  try {
    dispatch({
      type: actionType.EDIT_USER_REQUEST_SEND
    })

    const {data} = await requestApi().request(EDIT_USER,{
      method: 'POST',
      data: user
    })

    // console.log("edit data", data)
    if(data.status){
      toast.success(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_USER_REQUEST_SUCCESS,
          payload: data.status
        })
      }, 500);
    }else{
      toast.warn(data.error, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      dispatch({
        type: actionType.EDIT_USER_REQUEST_FAIL,
        payload: data.error
      })
    }

  } catch (error) {
    dispatch({
      type: actionType.EDIT_USER_REQUEST_FAIL,
      payload: error.message
    })
  }

}
