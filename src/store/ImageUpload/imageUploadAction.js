import { IMAGE_UPLOAD } from '../../network/Api'
import requestApi from '../../network/httpRequest'
import * as actionType from '../actionType'


export const imageUpload = (values) => async (dispatch) =>{
    console.log({values})
    try {
        dispatch({
            type: actionType.IMAGE_UPLOAD_REQUEST_SEND
        })

        const {data} = await requestApi().request(IMAGE_UPLOAD,{
            method: "POST",
            data: values
            
        })

        console.log({data})

        if(data.status){
            dispatch({
                type: actionType.IMAGE_UPLOAD_REQUEST_SUCCESS,
                payload: data.data
            })
        }else{
            dispatch({
                type: actionType.IMAGE_UPLOAD_REQUEST_FAIL,
                payload: data.message
            })
        }

    } catch (error) {
        dispatch({
            type: actionType.IMAGE_UPLOAD_REQUEST_FAIL,
            payload: error.message
        })
    }
}