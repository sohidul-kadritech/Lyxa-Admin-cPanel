import { IMAGE_UPLOAD } from '../../network/Api'
import requestApi from '../../network/httpRequest'
import * as actionType from '../actionType'


export const imageUpload = (value, type) => async (dispatch) =>{
    console.log({value})
    try {
        dispatch({
            type: actionType.IMAGE_UPLOAD_REQUEST_SEND
        })
        let formData = new FormData();
        formData.append('image', value)
        console.log({formData})
        const {data} = await requestApi().request(IMAGE_UPLOAD,{
            method: "POST",
            data: formData
            
        })

        console.log({data})

        if(data.status){
            dispatch({
                type: actionType.IMAGE_UPLOAD_REQUEST_SUCCESS,
                payload: {image: data.data, type}
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