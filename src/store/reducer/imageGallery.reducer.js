/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-case-declarations */
/* eslint-disable default-param-last */
import * as actionTypes from '../actionType';

const initialState = {
  loading: false,
  error: null,
  selectedImages: [],
  galleryList: [],
  nextPage: 1,
  previousPage: 1,
  currentPage: 1,
  hasNextPage: true,
  haspreviousPage: false,
  totalImage: 0,
  limit: 10,
  paging: [],
};

const galleryReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.IMAGE_GALLEY_MARK_SELECT:
      return {
        ...state,
        selectedImages: [payload, ...state.selectedImages],
      };

    case actionTypes.IMAGE_GALLEY_MARK_REMOVE_ALL:
      return {
        ...state,
        selectedImages: [],
      };

    case actionTypes.IMAGE_GALLEY_MARK_REMOVE:
      const list = state.selectedImages;
      var index = list.indexOf(payload);
      list.splice(index, 1);

      return {
        ...state,
        selectedImages: [...list],
      };

    case actionTypes.IMAGE_GALLEY_LIST_REQUEST_SEND:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.IMAGE_GALLEY_LIST_REQUEST_SUCCESS:
      const { galleryList, nextPage, hasNextPage, totalImage, paging, currentPage, previousPage, haspreviousPage } =
        payload;

      return {
        ...state,
        loading: false,
        error: null,
        galleryList,
        hasNextPage,
        nextPage,
        totalImage,
        paging,
        currentPage,
        previousPage,
        haspreviousPage,
      };

    case actionTypes.IMAGE_GALLEY_LIST_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default galleryReducer;
