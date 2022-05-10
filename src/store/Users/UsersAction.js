import { toast } from "react-toastify";
import { ADD_USER, ALL_USERS, EDIT_USER } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// USERS LIST

export const userList =
  (refresh = false, page = 1) =>
  async (dispatch, getState) => {
    const { users, searchKey, sortByKey, statusKey} =
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
            sortBy: sortByKey,
            status: statusKey
          },
        });

        console.log("users-----", data);

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

export const updateSortKey = (sortBy) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_USERS_SORT_KEY,
    payload: sortBy,
  });
};

// UPDATE STATUS KEY 

export const updateStatusKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_STATUS_KEY,
    payload: value,
  });
};


// // UPDATE SEARCH KEY

export const updateSearchKey = (value) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_USERS_SEARCH_KEY,
    payload: value,
  });
};





