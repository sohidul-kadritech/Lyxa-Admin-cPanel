import {
    GET_DASHBOARD_SUMMARY,
    GET_SELLER_DASHBOARD_SUMMARY,
    GET_SHOP_DASHBOARD_SUMMARY,
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

export const getDashboardSummary = (userType) => async (dispatch, getState) => {
    const { startDate, endDate } = getState().dashboardReducer;

    try {
        dispatch({
            type: actionType.GET_DASHBOARD_SUMMARY_REQUEST_SEND,
        });

        const { data } = await requestApi().request(
            userType === "admin"
                ? GET_DASHBOARD_SUMMARY
                : userType === "seller"
                    ? GET_SELLER_DASHBOARD_SUMMARY
                    : GET_SHOP_DASHBOARD_SUMMARY,
            {
                params: {
                    startDate,
                    endDate,
                },
            }
        );

        if (data.status) {
            dispatch({
                type: actionType.GET_DASHBOARD_SUMMARY_REQUEST_SUCCESS,
                payload: data.data,
            });
        } else {
            dispatch({
                type: actionType.GET_DASHBOARD_SUMMARY_REQUEST_FAIL,
                payload: data.message,
            });
        }
    } catch (error) {
        dispatch({
            type: actionType.GET_DASHBOARD_SUMMARY_REQUEST_FAIL,
            payload: error.message,
        });
    }
};

export const updateOrderGraph = (startDate) => (dispatch) => {
    dispatch({
        type: actionType.UPDATE_DASHBOARD_CARD_START_DATE_FILTER,
        payload: startDate,
    });
};

export const updateDashboardCardStartDate = (startDate) => (dispatch) => {
    dispatch({
        type: actionType.UPDATE_DASHBOARD_CARD_START_DATE_FILTER,
        payload: startDate,
    });
};

export const updateDashboardCardEndDate = (date) => (dispatch) => {
    dispatch({
        type: actionType.UPDATE_DASHBOARD_CARD_END_DATE_FILTER,
        payload: date,
    });
};
