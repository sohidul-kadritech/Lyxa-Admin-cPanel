import * as actionTypes from "../../actionType";

const initialState = {
    loading: false,
    folderList: [],
    error: null
}

const imageReducer = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case actionTypes.IMAGE_FOLDER_LIST_REQUEST_SEND:
            return {
                ...state,
                loading: true,
                error: null
            }
        case actionTypes.IMAGE_FOLDER_LIST_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                folderList: payload,
                error: null
            }

        case actionTypes.IMAGE_FOLDER_LIST_ADD:

            return {
                ...state,
                folderList: [...state.folderList,payload],
                error: null
            }


        case actionTypes.IMAGE_FOLDER_LIST_REQUEST_FAIL:
            return {
                ...state,
                loading: false,
                error: payload
            };
        default:
            return state;
    }
}






export default imageReducer;