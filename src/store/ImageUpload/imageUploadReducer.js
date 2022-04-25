import * as actionType from '../actionType'

const initialState = {
    loading: false,
    bannerImage: null,
    imageStatus: false,
    error: null
}

const imageUploadReducer = (state = initialState, action) =>{
    const {type, payload} = action;

    switch (type) {
        case actionType.IMAGE_UPLOAD_REQUEST_SEND:
            return{
                ...state,
                loading: true,
                imageStatus: false,
                error: null
            }
            case actionType.IMAGE_UPLOAD_REQUEST_SUCCESS:
                // if(payload.type == 'banner'){

                //     state.bannerImage = payload.image
                    
                // }
                return{
                    ...state,
                    loading: false,
                    imageStatus: true,
                    error: null,
                    bannerImage: payload.image
                }
                case actionType.IMAGE_UPLOAD_REQUEST_FAIL:
                    return{
                        ...state,
                        loading: false,
                        error: payload
                    }
        default:
            return state;
    }
}

export default imageUploadReducer;