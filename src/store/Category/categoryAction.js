import { toast } from "react-toastify";
import { ADD_CATEGORY, ADD_SUB_CATEGORY, EDIT_CATEGORY, EDIT_SUB_CATEGORY, GET_ALL_CATEGORY, GET_ALL_SUB_CATEGORY } from "../../network/Api";
import requestApi from "../../network/httpRequest";
import * as actionType from "../actionType";


export const addCategory = (values) => async dispatch =>{
    console.log({values})
    try {
        dispatch({
            type: actionType.ADD_CATEGORY_REQUEST_SEND
        })

        const {data} = await requestApi().request(ADD_CATEGORY,{
            method: "POST",
            data: values
        })

        console.log({data})

        if(data.status){
            toast.success(data.message, {
                // position: "bottom-right",
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            dispatch({
                type: actionType.ADD_CATEGORY_REQUEST_SUCCESS,
                payload: data.data.category
            })
        }else{
            toast.warn(data.message, {
                // position: "bottom-right",
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              dispatch({
                  type: actionType.ADD_CATEGORY_REQUEST_FAIL,
                  payload: data.message
              })
        }

    } catch (error) {
        dispatch({
            type: actionType.ADD_CATEGORY_REQUEST_FAIL,
            payload: error.message
        })
    }
}

export const getAllCategory =(refresh = false, page=1) => async (dispatch, getState) => {
    // console.log({adminData})
    const { categories } = getState().categoryReducer;

    if (categories.length < 1 || refresh) {
      try {
        dispatch({
          type: actionType.GET_ALL_CATEGORY_REQUEST_SEND,
        });

        const { data } = await requestApi().request(GET_ALL_CATEGORY,{
            params: {
                page: page,
                pageSize: 3,
            }
        });

        // console.log({ data });

        if (data.status) {
          dispatch({
            type: actionType.GET_ALL_CATEGORY_REQUEST_SUCCESS,
            payload: data.data,
          });
        } else {
          dispatch({
            type: actionType.GET_ALL_CATEGORY_REQUEST_FAIL,
            payload: data.message,
          });
        }
      } catch (error) {
        dispatch({
          type: actionType.GET_ALL_CATEGORY_REQUEST_FAIL,
          payload: error.message,
        });
      }
    }
  };

//   EDIT 

export const editCategory = (values) => async (dispatch) => {
    console.log({ values });
    try {
      dispatch({
        type: actionType.EDIT_CATEGORY_REQUEST_SEND,
      });
  
      const { data } = await requestApi().request(EDIT_CATEGORY, {
        method: "POST",
        data: values,
      });
  
      console.log({ data });
  
      if (data.status) {
        // console.log("success-----------")
        toast.success(data.message, {
          // position: "bottom-right",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
  
        setTimeout(() => {
          dispatch({
            type: actionType.EDIT_CATEGORY_REQUEST_SUCCESS,
            payload: data.data.category,
          });
        }, 400);
      } else {
        toast.warn(data.message, {
          // position: "bottom-right",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
  
        dispatch({
          type: actionType.EDIT_CATEGORY_REQUEST_FAIL,
          paylaod: data.message,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.EDIT_CATEGORY_REQUEST_FAIL,
        paylaod: error.message,
      });
    }
  };


  // SET STATUS FALSE

export const setCatStatusFalse = () => (dispatch) => {
    dispatch({
      type: actionType.SET_STATUS_FALSE,
    });
  };

  // ADD SUB CATGEGORY

  export const addSubCategory = (values) => async dispatch =>{
    console.log({values})
    try {
        dispatch({
            type: actionType.ADD_SUB_CATEGORY_REQUEST_SEND
        })

        const {data} = await requestApi().request(ADD_SUB_CATEGORY,{
            method: "POST",
            data: values
        })

        // console.log({data})

        if(data.status){
            toast.success(data.message, {
                // position: "bottom-right",
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            dispatch({
                type: actionType.ADD_SUB_CATEGORY_REQUEST_SUCCESS,
                payload: data.data.addSubCategory
            })
        }else{
            toast.warn(data.message, {
                // position: "bottom-right",
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              dispatch({
                  type: actionType.ADD_SUB_CATEGORY_REQUEST_FAIL,
                  payload: data.message
              })
        }

    } catch (error) {
        dispatch({
            type: actionType.ADD_SUB_CATEGORY_REQUEST_FAIL,
            payload: error.message
        })
    }
}

// GET ALL SUB CATEGORY BY CATEGORY 

export const getAllSubCategory =(refresh = false, page=1, CatId) => async (dispatch, getState) => {
  // console.log({CatId})
  const { subCategories } = getState().categoryReducer;

  if (subCategories.length < 1 || refresh) {
    try {
      dispatch({
        type: actionType.GET_ALL_SUB_CATEGORY_REQUEST_SEND,
      });

      const { data } = await requestApi().request(GET_ALL_SUB_CATEGORY,{
          params: {
              id: CatId,
              page: page,
              pageSize: 10,
              searchKey: "",
              status: "active"
          }
      });

      console.log({ data });

      if (data.status) {
        dispatch({
          type: actionType.GET_ALL_SUB_CATEGORY_REQUEST_SUCCESS,
          payload: data.data,
        });
      } else {
        dispatch({
          type: actionType.GET_ALL_SUB_CATEGORY_REQUEST_FAIL,
          payload: data.message,
        });
      }
    } catch (error) {
      dispatch({
        type: actionType.GET_ALL_SUB_CATEGORY_REQUEST_FAIL,
        payload: error.message,
      });
    }
  }
};

// EDIT SUB CATEGORY 

export const editSubCategory = (values) => async (dispatch) => {
  // console.log({ values });
  try {
    dispatch({
      type: actionType.EDIT_SUB_CATEGORY_REQUEST_SEND,
    });

    const { data } = await requestApi().request(EDIT_SUB_CATEGORY, {
      method: "POST",
      data: values,
    });

    // console.log({ data });

    if (data.status) {
      // console.log("success-----------")
      toast.success(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_SUB_CATEGORY_REQUEST_SUCCESS,
          payload: data.data.category,
        });
      }, 400);
    } else {
      toast.warn(data.message, {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      dispatch({
        type: actionType.EDIT_SUB_CATEGORY_REQUEST_FAIL,
        paylaod: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_SUB_CATEGORY_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};



  