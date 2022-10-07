import { GET_DASHBOARD_SUMMARY, GET_SELLER_DASHBOARD_SUMMARY, GET_SHOP_DASHBOARD_SUMMARY } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";

export const getDashboardSummary =
    (userType) =>
        async (dispatch, getState) => {



            try {
                dispatch({
                    type: actionType.GET_DASHBOARD_SUMMARY_REQUEST_SEND,
                });

                const { data } = await requestApi().request(userType === 'admin' ? GET_DASHBOARD_SUMMARY : userType === 'seller' ? GET_SELLER_DASHBOARD_SUMMARY : GET_SHOP_DASHBOARD_SUMMARY);

                console.log({ data });

                if (data.status) {
                    const { summery } = data.data;
                    dispatch({
                        type: actionType.GET_DASHBOARD_SUMMARY_REQUEST_SUCCESS,
                        payload: summery
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