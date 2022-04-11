import * as actionType from "../actionType";
import requestApi from "../../network/httpRequest";
import { GET_GALLERY_LIST } from "../../network/Api";
// INITIALIZES CLOCK ON SERVER
// export const galleryAction = () => async (dispatch, getState) => {

//     try {
//         dispatch({
//             type: actionType.UPLOAD_IMAGE_REQUEST_SEND
//         })

//         let formData = new FormData();

//         const selectedFiles = getState.uploadImage.selectedFiles;

//         for (const key of Object.keys(selectedFiles)) {
//             formData.append('imagesArray', selectedFiles[key])
//         }

//         const { data } = await axios.post("http://localhost:8000/endpoint/multi-images-upload", formData, {
//         });

//         console.log("data", data);

//         if (data.status) {
//             dispatch({
//                 type: actionType.UPLOAD_IMAGE_REQUEST_SUCCESS,
//                 payload: data.data,
//             })
//         } else {
//             dispatch({
//                 type: actionType.UPLOAD_IMAGE_REQUEST_FAIL,
//                 payload: data.error,
//             })

//         }

//     } catch (error) {
//         dispatch({
//             type: actionType.UPLOAD_IMAGE_REQUEST_FAIL,
//             payload: error.message,
//         })
//     }

// }

export const selectImageGallery = (item, index) => async (
  dispatch,
  getState
) => {
  const list = getState().galleryReducer.selectedImages;

  var have = list.find(i => i.id === item.id);

  if (have) {
    dispatch({
      type: actionType.IMAGE_GALLEY_MARK_REMOVE,
      payload: item
    });
  } else {
    dispatch({
      type: actionType.IMAGE_GALLEY_MARK_SELECT,
      payload: item
    });
  }
};

export const removeImageGallery = index => (dispatch, getState) => {
  dispatch({
    type: actionType.IMAGE_GALLEY_MARK_REMOVE,
    payload: index
  });
};

export const removeAllSelectedGalleryImage = () => (dispatch, getState) => {
  dispatch({
    type: actionType.IMAGE_GALLEY_MARK_REMOVE_ALL
  });
};

export const getGalleryList = ({ page = 1, folder }) => async (
  dispatch,
  getState
) => {
  console.log("folder", folder);

  try {
    dispatch({
      type: actionType.IMAGE_GALLEY_LIST_REQUEST_SEND
    });

    let limit = getState().galleryReducer.limit;

    const request = requestApi();

    const params = {
      page: page,
      limitData: limit,
      folder: folder ? folder.value : null
    };

    // console.log("params", params);

    const { data } = await request(GET_GALLERY_LIST, {
      params: params
    });

    // if(data.tokenError){
    //   localStorage.removeItem("admin")
    //   localStorage.removeItem("accessToken")
    //   return
    // }

    if (!data.status) {
      dispatch({
        type: actionType.IMAGE_GALLEY_LIST_REQUEST_FAIL,
        payload: data.message
      });
    } else {
      dispatch({
        type: actionType.IMAGE_GALLEY_LIST_REQUEST_SUCCESS,

        payload: {
          galleryList: data.imageList,
          nextPage: data.nextPage,
          hasNextPage: data.hasNextPage,
          previousPage: data.previousPage,
          totalImage: data.totalImage,
          paging: data.paging,
          currentPage: data.currentPage,
          haspreviousPage: data.haspreviousPage
        }
      });
    }
  } catch (e) {
    console.log(e);
    dispatch({
      type: actionType.IMAGE_GALLEY_LIST_REQUEST_FAIL,
      payload: e.message
    });
  }
};
