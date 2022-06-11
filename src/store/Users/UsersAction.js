import { toast } from "react-toastify";
import {
  ADD_USER,
  ALL_USERS,
  EDIT_USER,
  USER_TRANSACTIONS,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

// USERS LIST

export const userList =
  (refresh = false, page = 1) =>
  async (dispatch, getState) => {
    const { users, searchKey, sortByKey, statusKey } = getState().usersReducer;

    try {
      if (users.length < 1 || refresh) {
        dispatch({
          type: actionType.GET_ALL_USERS_REQUEST_SEND,
        });

        const { data } = await requestApi().request(ALL_USERS, {
          params: {
             searchKey,
            page,
            pageSize: 30,
            sortBy: sortByKey.value,
            status: statusKey.value,
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

// TRANSACTIONS

export const userTransactions =
  (refresh = false, id, page = 1) =>
  async (dispatch, getState) => {
    // console.log({id})
    try {
      const { startDate, endDate, sortBy } = getState().usersReducer;

      dispatch({
        type: actionType.USER_TRANSACTIONS_REQUEST_SEND,
      });

      const { data } = await requestApi().request(USER_TRANSACTIONS, {
        params: {
          page,
          pageSize: 50,
          userId: id,
          startDate,
          endDate,
          sortBy: sortBy.value,
        },
      });
      console.log({ data });

      if (data.status) {
        dispatch({
          type: actionType.USER_TRANSACTIONS_REQUEST_SUCCESS,
          payload: data.data,
        });
      } else {
        dispatch({
          type: actionType.USER_TRANSACTIONS_REQUEST_FAIL,
          payload: data.message,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.USER_TRANSACTIONS_REQUEST_FAIL,
        payload: error.message,
      });
    }
  };

// UPDATE SORT BY KEY

export const updateSortByKey = (type) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_SORT_BY_KEY,
    payload: type,
  });
};

export const updateTransStartDate = (startDate) => (dispatch) => {
  dispatch({
    type: actionType.UPDATE_START_DATE,
    payload: startDate,
  });
};

export const updateTransEndDate = (date) => (dispatch) => {
  // console.log({date})
  dispatch({
    type: actionType.UPDATE_END_DATE,
    payload: date,
  });
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
