import * as actionType from "../actionType";

const initialState = {
    loading: false,
    status: false,
    error: null,
    summery: null
}

const dashboardReducer = (state = initialState, action) => {

    const { payload, type } = action;

    switch (type) {
        case actionType.ADD_SELLER_REQUEST_SEND:
            return {
                ...state,
                loading: true,
                status: false,
                error: null
            }

        case actionType.GET_DASHBOARD_SUMMARY_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                status: true,
                summery: payload
            }
        case actionType.GET_DASHBOARD_SUMMARY_REQUEST_FAIL:
            return {
                ...state,
                loading: false,
                error: payload
            }

        default:
            return state;
    }

}

export default dashboardReducer;