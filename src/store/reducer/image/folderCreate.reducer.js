import * as actionTypes from "../../actionType";

const initialState = {
    idLoading: false,
    message:null,
    error:null
}

const folderCreateReducer = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case actionTypes.IMAGE_FOLDER_ADD_REQUEST_SEND:
            return {
                ...state,
                idLoading: true,
                error:false
            }
        case actionTypes.IMAGE_FOLDER_ADD_REQUEST_SUCCESS:
            return {
                ...state,
                idLoading: false,
                message:payload,
                error: null
            }
        case actionTypes.IMAGE_FOLDER_ADD_REQUEST_FAIL:
            return {
                ...state,
                idLoading: false,
                error: payload
            };
        default:
            return state;
    }
}






export default folderCreateReducer;