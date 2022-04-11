import {
  IMAGE_UPLOAD,
  LIST_IMAGE_FOLDER,
  MULTIPLE_IMAGE_UPLOAD
} from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";
const axios = require("axios").default;

// INITIALIZES CLOCK ON SERVER
export const uploadMultipleImage = () => async (dispatch, getState) => {


  try {


    dispatch({
      type: actionType.UPLOAD_IMAGE_REQUEST_SEND
    })

    let formData = new FormData();

    const selectedFiles = getState().uploadImage.selectedFiles;
    const selectedFolder = getState().uploadImage.selectedFolder;

    formData.append('folderPath', selectedFolder.value);

    for (const key of Object.keys(selectedFiles)) {
      formData.append('images', selectedFiles[key])
    }


    const result = await fetch(MULTIPLE_IMAGE_UPLOAD, {
      method: 'POST',
      body: formData,
    });

    const response = await result.json();


    console.log(response)

    if (!response.status) {

      dispatch({
        type: actionType.UPLOAD_IMAGE_REQUEST_FAIL,
        payload: response.error,
      })

    }


    if (response.status) {
      dispatch({
        type: actionType.UPLOAD_IMAGE_REQUEST_SUCCESS,
        payload: response.data.imageList,
      })
    }


  } catch (error) {
    console.log(error);
    dispatch({
      type: actionType.UPLOAD_IMAGE_REQUEST_FAIL,
      payload: error.message,
    })
  }

};

export const selectImage = files => async (dispatch, getState) => {
  // const list = getState().uploadImage.selectedFiles

  try {
    // console.log("files", files);
    dispatch({
      type: actionType.SELECT_IMAGE,
      payload: files
    });
  } catch (error) {
    dispatch({
      type: actionType.IMAGE_SELECTION_ERROR,
      payload: error.message
    });
  }
};

export const removeImage = index => (dispatch, getState) => {
  // const list = getState().uploadImage.selectedFiles
  dispatch({
    type: actionType.REMOVE_IMAGE,
    payload: index
  });
};

export const clearUploadImage = () => (dispatch, getState) => {
  // const list = getState().uploadImage.selectedFiles

  console.log("---");

  dispatch({
    type: actionType.UPLOAD_IMAGE_DONE
  });
};

export const selectFolder = item => (dispatch, getState) => {
  // const list = getState().uploadImage.selectedFiles
  dispatch({
    type: actionType.SELECT_FOLDER,
    payload: item
  });
};

export const addFolderList = list => async (dispatch, getState) => {
  // const list = getState().uploadImage.selectedFiles

  if (list.length > 0) {
    dispatch({
      type: actionType.ADD_LIST_FOLDER,
      payload: list
    });
  } else {
    try {
      const request = requestApi();
      const { data } = await request(LIST_IMAGE_FOLDER);

      if (data.status) {
        dispatch({
          type: actionType.IMAGE_FOLDER_LIST_REQUEST_SUCCESS,
          payload: data.data.imageFolder
        });

        dispatch({
          type: actionType.ADD_LIST_FOLDER,
          payload: data.data.imageFolder
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
