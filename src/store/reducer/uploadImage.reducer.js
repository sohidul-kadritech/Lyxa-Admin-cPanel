import * as actionTypes from "../actionType";

const initialState = {
    loading: false,
    error: null,
    selectedFiles: [],
    folderList: [],
    selectedFolder: null,
    uploadedImages: [],
    message: null,

}


const uploadImageReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {
        case actionTypes.UPLOAD_IMAGE_REQUEST_SEND:
            return {
                ...state,
                error: null,
                loading: true
            };

        case actionTypes.SELECT_IMAGE:
            return {
                ...state,
                selectedFiles: [...state.selectedFiles, ...payload]
            };

        case actionTypes.REMOVE_IMAGE:
            const list = state.selectedFiles
            list.splice(payload, 1);

            return {
                ...state,
                selectedFiles: [...list]
            };


        case actionTypes.SELECT_FOLDER:

            return {
                ...state,
                selectedFolder: payload
            };


        case actionTypes.ADD_LIST_FOLDER:

            var newList = [{
                label:"None",
                value:null
            }];

            payload.forEach(element => {
                newList.push({ label: element.name, value: element.name })

            });

            return {
                ...state,
                folderList: newList
            };


        case actionTypes.UPLOAD_IMAGE_REQUEST_SUCCESS:

            console.log("reducer payload", payload);



            return {
                ...state,
                loading: false,
                message: "",
                error: null,
                selectedFiles: [],
                uploadedImages: payload
            };



        case actionTypes.UPLOAD_IMAGE_REQUEST_FAIL:
            return {
                ...state,
                loading: false,
                error: payload
            };




        case actionTypes.UPLOAD_IMAGE_DONE:

            console.log('====================================');
            console.log("------done");
            console.log('====================================');

            return {
                ...state,
                error: null,
                uploadedImages: []
            };

        case actionTypes.IMAGE_SELECTION_ERROR:
            return {
                ...state,
                error: payload
            };





        default:
            return state;
    }

}






export default uploadImageReducer;