import { ADD_NEW_RATING, EDIT_NEW_RATING, GET_ALL_RATINGS } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionTypes from '../actionType';

export const getAllRatings = () => async (dispatch) => {
  dispatch({
    type: actionTypes.GET_ALL_RATINGS_REQUEST_SEND,
  });

  try {
    const { data } = await requestApi().request(GET_ALL_RATINGS, {
      method: 'GET',
    });

    if (data?.status) {
      const list = data?.data?.ratingSetting?.filter((item) => item?.tags?.length > 0);
      // const newList = list.map((item) => item);
      dispatch({
        type: actionTypes.GET_ALL_RATINGS_REQUEST_SUCCESS,
        payload: list,
      });
    } else {
      dispatch({
        type: actionTypes.GET_ALL_RATINGS_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.GET_ALL_RATINGS_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

export const addNewRating = (ratings) => async (dispatch, getState) => {
  const store = getState();
  const { ratings: storedList } = store.ratingReducer;

  dispatch({
    type: actionTypes.ADD_NEW_RATING_REQUEST_SEND,
  });

  try {
    const { data } = await requestApi().request(ADD_NEW_RATING, {
      method: 'POST',
      data: ratings,
    });

    console.log({ storedList });

    if (data?.status) {
      let isFound = false;

      const newList = storedList.map((item) => {
        if (item?.rating === Number(ratings?.rating)) {
          isFound = true;
          return data?.data?.ratingSetting;
        }
        return item;
      });

      if (isFound === false) {
        newList.push(data?.data?.ratingSetting);
      }

      dispatch({
        type: actionTypes.ADD_NEW_RATING_REQUEST_SUCCESS,
        payload: newList,
      });
    } else {
      dispatch({
        type: actionTypes.ADD_NEW_RATING_REQUEST_FAIL,
        payload: data?.message,
      });
    }
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.ADD_NEW_RATING_REQUEST_FAIL,
      payload: error?.message,
    });
  }
};

export const updateRatings = (rating) => async (dispatch, getState) => {
  const store = getState();
  const { ratings: storedList } = store.ratingReducer;

  dispatch({
    type: actionTypes.UPDATE_RATING_REQUEST_SEND,
  });

  try {
    const { data } = await requestApi().request(EDIT_NEW_RATING, {
      method: 'POST',
      data: {
        ...rating,
        id: rating._id,
      },
    });

    if (data.status) {
      const updatedRating = data?.data?.ratingSetting;
      let newList;

      if (updatedRating?.tags?.length === 0) {
        newList = storedList.filter((item) => item.rating !== updatedRating.rating);
      } else {
        newList = storedList.map((item) => {
          if (item.rating === updatedRating.rating) {
            item.tags = updatedRating.tags;
            return item;
          }

          return item;
        });
      }

      dispatch({
        type: actionTypes.UPDATE_RATING_REQUEST_SUCCESS,
        payload: newList,
      });

      console.log(newList);
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateRatingIsAdded = (status) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_RATING_IS_ADDED,
    payload: status,
  });
};

export const updateRatingIsUpdated = (status) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_RATING_IS_UPDATED,
    payload: status,
  });
};
