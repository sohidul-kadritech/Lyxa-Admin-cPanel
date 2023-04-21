/* eslint-disable default-param-last */
import moment from 'moment';
import * as actionType from '../actionType';

const initialState = {
  loading: false,
  status: false,
  error: null,
  dashboardData: {
    summery: null,
    top_activity: null,
  },
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().endOf('month').format('YYYY-MM-DD'),
};

const dashboardReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case actionType.GET_DASHBOARD_SUMMARY_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        status: false,
        error: null,
      };

    case actionType.GET_DASHBOARD_SUMMARY_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        dashboardData: payload,
      };
    case actionType.GET_DASHBOARD_SUMMARY_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case actionType.UPDATE_DASHBOARD_CARD_START_DATE_FILTER:
      return {
        ...state,
        startDate: payload,
      };

    case actionType.UPDATE_DASHBOARD_CARD_END_DATE_FILTER:
      return {
        ...state,
        endDate: payload,
      };

    default:
      return state;
  }
};

export default dashboardReducer;
