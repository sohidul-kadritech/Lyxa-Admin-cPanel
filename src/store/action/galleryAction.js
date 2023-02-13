import { GET_GALLERY_LIST } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import * as actionType from '../actionType';

export const selectImageGallery = (item) => async (dispatch, getState) => {
  const list = getState().galleryReducer.selectedImages;

  const have = list.find((i) => i.id === item.id);

  if (have) {
    dispatch({
      type: actionType.IMAGE_GALLEY_MARK_REMOVE,
      payload: item,
    });
  } else {
    dispatch({
      type: actionType.IMAGE_GALLEY_MARK_SELECT,
      payload: item,
    });
  }
};

export const removeImageGallery = (index) => (dispatch) => {
  dispatch({
    type: actionType.IMAGE_GALLEY_MARK_REMOVE,
    payload: index,
  });
};

export const removeAllSelectedGalleryImage = () => (dispatch) => {
  dispatch({
    type: actionType.IMAGE_GALLEY_MARK_REMOVE_ALL,
  });
};

export const getGalleryList =
  ({ page = 1, folder }) =>
  async (dispatch, getState) => {
    console.log('folder', folder);

    try {
      dispatch({
        type: actionType.IMAGE_GALLEY_LIST_REQUEST_SEND,
      });

      const { limit } = getState().galleryReducer;

      const request = requestApi();

      const params = {
        page,
        limitData: limit,
        folder: folder ? folder.value : null,
      };

      const { data } = await request(GET_GALLERY_LIST, {
        params,
      });

      if (!data.status) {
        dispatch({
          type: actionType.IMAGE_GALLEY_LIST_REQUEST_FAIL,
          payload: data.message,
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
            haspreviousPage: data.haspreviousPage,
          },
        });
      }
    } catch (e) {
      console.log(e);
      dispatch({
        type: actionType.IMAGE_GALLEY_LIST_REQUEST_FAIL,
        payload: e.message,
      });
    }
  };
