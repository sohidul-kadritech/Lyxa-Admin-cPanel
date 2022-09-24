import {
  ADD_ADMIN,
  ADD_SELLER_CREDENTIAL,
  ADD_SHOP_CREDENTIAL,
  DELETE_ADMIN,
  EDIT_ADMIN,
  GET_ALL_ADMIN,
  GET_SELLER_CREDENTIALS,
  GET_SHOP_CREDENTIALS,
  REMOVE_SELLER_CREDENTIAL,
  REMOVE_SHOP_CREDENTIAL,
} from "../../../network/Api";
import * as actionType from "../../actionType";
import requestApi from "./../../../network/httpRequest";
import { successMsg } from "../../../helpers/successMsg";

// ADD

export const addAdmin = (adminData) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_ADMIN_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_ADMIN, {
      method: "POST",
      data: adminData,
    });

    if (data.status) {
      successMsg(data.message, "success");

      dispatch({
        type: actionType.ADD_ADMIN_REQUEST_SUCCESS,
        payload: data.data.admin,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.ADD_ADMIN_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_ADMIN_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET ALL_

export const getAllAdmin =
  (refresh = false) =>
    async (dispatch, getState) => {
      const { admins } = getState().adminReducer;

      if ((admins && admins.length < 1) || refresh) {
        try {
          dispatch({
            type: actionType.GET_ALL_ADMIN_REQUEST_SEND,
          });

          const { data } = await requestApi().request(GET_ALL_ADMIN);

          console.log(data);

          if (data.status) {
            dispatch({
              type: actionType.GET_ALL_ADMIN_REQUEST_SUCCESS,
              payload: data.data.Admins,
            });
          } else {
            dispatch({
              type: actionType.GET_ALL_ADMIN_REQUEST_FAIL,
              payload: data.message,
            });
          }
        } catch (error) {
          dispatch({
            type: actionType.GET_ALL_ADMIN_REQUEST_FAIL,
            payload: error.message,
          });
        }
      }
    };

// DELETE

export const deleteAdmin = (value) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.DELETE_ADMIN_REQUEST_SEND,
    });

    const { data } = await requestApi().request(DELETE_ADMIN, {
      method: "POST",
      data: value,
    });

    if (data.status) {
      successMsg(data.message, "success");
      dispatch({
        type: actionType.DELETE_ADMIN_REQUEST_SUCCESS,
        payload: data?.data?.admin,
      });
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.DELETE_ADMIN_REQUEST_FAIL,
        payload: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.DELETE_ADMIN_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// EDIT

export const editAdmin = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.EDIT_ADMIN_REQUEST_SEND,
    });

    const { data } = await requestApi().request(EDIT_ADMIN, {
      method: "POST",
      data: values,
    });

    if (data.status) {
      successMsg(data.message, "success");

      setTimeout(() => {
        dispatch({
          type: actionType.EDIT_ADMIN_REQUEST_SUCCESS,
          payload: data.data.admin,
        });
      }, 300);
    } else {
      successMsg(data.message, "error");
      dispatch({
        type: actionType.EDIT_ADMIN_REQUEST_FAIL,
        paylaod: data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.EDIT_ADMIN_REQUEST_FAIL,
      paylaod: error.message,
    });
  }
};

// SET STATUS FALSE

export const setStatusFalse = () => (dispatch) => {
  dispatch({
    type: actionType.SET_STATUS_FALSE,
  });
};

// ADD SELLER CREDENTIAL

export const addSellerCredential = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_SELLER_CREDENTIAL_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_SELLER_CREDENTIAL, {
      method: "POST",
      data: values,
    });

    console.log({ data: data });

    if (data.status) {
      // const { seller } = data?.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_SELLER_CREDENTIAL_REQUEST_SUCCESS,
        // payload: seller,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_SELLER_CREDENTIAL_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_SELLER_CREDENTIAL_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// ADD SHOP CREDENTIAL

export const addShopCredential = (values) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.ADD_SHOP_CREDENTIAL_REQUEST_SEND,
    });

    const { data } = await requestApi().request(ADD_SHOP_CREDENTIAL, {
      method: "POST",
      data: values,
    });


    if (data.status) {
      // const { seller } = data?.data;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.ADD_SHOP_CREDENTIAL_REQUEST_SUCCESS,
        // payload: seller,
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.ADD_SHOP_CREDENTIAL_REQUEST_FAIL,
        payload: data.error,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.ADD_SHOP_CREDENTIAL_REQUEST_FAIL,
      payload: error.message,
    });
  }
};

// GET SELLER CREDENTIALS

export const getAllSellerCredentials =
  (refresh = false, id) =>
    async (dispatch, getState) => {
      const { sellerCredentials } = getState().adminReducer;

      if ((sellerCredentials && sellerCredentials.length < 1) || refresh) {
        try {
          dispatch({
            type: actionType.GET_SELLER_CREDENTIALS_REQUEST_SEND,
          });

          const { data } = await requestApi().request(GET_SELLER_CREDENTIALS, {
            params: {
              id
            }
          });


          if (data.status) {
            const { childSellers } = data?.data?.credentials;
            dispatch({
              type: actionType.GET_SELLER_CREDENTIALS_REQUEST_SUCCESS,
              payload: childSellers,
            });
          } else {
            dispatch({
              type: actionType.GET_SELLER_CREDENTIALS_REQUEST_FAIL,
              payload: data.message,
            });
          }
        } catch (error) {
          dispatch({
            type: actionType.GET_SELLER_CREDENTIALS_REQUEST_FAIL,
            payload: error.message,
          });
        }
      }
    };

// REMOVE SELLER CREDENTIALS


export const removeSellerCredential = (sellerId) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.REMOVE_SELLER_CREDENTIAL_REQUEST_SEND,
    })

    const { data } = await requestApi().request(REMOVE_SELLER_CREDENTIAL, {
      method: "POST",
      data: {
        sellerId
      },


    });

    console.log({ data })

    if (data.status) {
      const { childSellers } = data?.data?.remaining;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.REMOVE_SELLER_CREDENTIAL_REQUEST_SUCCESS,
        payload: childSellers
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.REMOVE_SELLER_CREDENTIAL_REQUEST_FAIL,
        payload: data.error,
      });
    }

  } catch (e) {
    successMsg(e.message, "error");

    dispatch({
      type: actionType.REMOVE_SELLER_CREDENTIAL_REQUEST_FAIL,
      payload: e.message,
    });
  }
}


// GET ALL SHOP CREDENTIALS 

export const getAllShopCredentials =
  (refresh = false, id) =>
    async (dispatch, getState) => {
      const { sellerCredentials } = getState().adminReducer;

      if ((sellerCredentials && sellerCredentials.length < 1) || refresh) {
        try {
          dispatch({
            type: actionType.GET_SHOP_CREDENTIALS_REQUEST_SEND,
          });

          const { data } = await requestApi().request(GET_SHOP_CREDENTIALS, {
            params: {
              id
            }
          });


          if (data.status) {
            const { credentials } = data?.data?.credentials;
            dispatch({
              type: actionType.GET_SHOP_CREDENTIALS_REQUEST_SUCCESS,
              payload: credentials,
            });
          } else {
            dispatch({
              type: actionType.GET_SHOP_CREDENTIALS_REQUEST_FAIL,
              payload: data.message,
            });
          }
        } catch (error) {
          dispatch({
            type: actionType.GET_SHOP_CREDENTIALS_REQUEST_FAIL,
            payload: error.message,
          });
        }
      }
    };


export const removeShopCredential = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: actionType.REMOVE_SHOP_CREDENTIAL_REQUEST_SEND,
    })

    const { data } = await requestApi().request(REMOVE_SHOP_CREDENTIAL, {
      method: "POST",
      data: {
        shopId
      },


    });


    if (data.status) {
      const { credentials } = data?.data?.remaining;
      successMsg(data.message, "success");
      dispatch({
        type: actionType.REMOVE_SHOP_CREDENTIAL_REQUEST_SUCCESS,
        payload: credentials
      });
    } else {
      successMsg(data.message, "error");

      dispatch({
        type: actionType.REMOVE_SHOP_CREDENTIAL_REQUEST_FAIL,
        payload: data.error,
      });
    }

  } catch (e) {
    successMsg(e.message, "error");

    dispatch({
      type: actionType.REMOVE_SELLER_CREDENTIAL_REQUEST_FAIL,
      payload: e.message,
    });
  }
}