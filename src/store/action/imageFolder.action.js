import { CREATE_IMAGE_FOLDER, LIST_IMAGE_FOLDER } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionType from '../actionType'


export const imageFolderListAction = () => async (dispatch, getState) => {


    try {
        dispatch({
            type: actionType.IMAGE_FOLDER_LIST_REQUEST_SEND
        })

        const request = requestApi()
        const { data } = await request(LIST_IMAGE_FOLDER);

        if (data.status) {
            dispatch({
                type: actionType.IMAGE_FOLDER_LIST_REQUEST_SUCCESS,
                payload: data.data.imageFolder,
            })
        } else {
            dispatch({
                type: actionType.IMAGE_FOLDER_LIST_REQUEST_FAIL,
                payload: data.error,
            })
        }

    } catch (error) {
        dispatch({
            type: actionType.IMAGE_FOLDER_LIST_REQUEST_FAIL,
            payload: error.message,
        })
    }

}


export const imageFolderCreateAction = (name) => async (dispatch, getState) => {


    try {
        dispatch({
            type: actionType.IMAGE_FOLDER_ADD_REQUEST_SEND
        })

        const request = requestApi()
        const { data } = await request(CREATE_IMAGE_FOLDER,{
            method:"POST",
            data:{
                folderName:name
            }
        });

        if (data.status) {

            dispatch({
                type: actionType.IMAGE_FOLDER_ADD_REQUEST_SUCCESS,
                payload: data.message,
            })

            dispatch({
                type:actionType.IMAGE_FOLDER_LIST_ADD,
                payload: data.data.folder,
            })
        } else {
            dispatch({
                type: actionType.IMAGE_FOLDER_ADD_REQUEST_FAIL,
                payload: data.error,
            })
        }

    } catch (error) {
        dispatch({
            type: actionType.IMAGE_FOLDER_ADD_REQUEST_FAIL,
            payload: error.message,
        })
    }

}