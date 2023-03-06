import { GET_ALL_RATINGS } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionTypes from '../actionType';

export const getAllRatings = () => async (dispatch) => {
  dispatch({
    type: actionTypes.GET_ALL_RATINGS_REQUEST_SEND,
  });

  try {
    const { data } = requestApi().request(GET_ALL_RATINGS, {
      method: 'GET',
    });

    if (data?.status) {
      dispatch({
        type: actionTypes.GET_ALL_RATINGS_REQUEST_SUCCESS,
        payload: data?.data?.ratingSetting,
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
