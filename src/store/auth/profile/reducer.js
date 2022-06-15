import { PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE, RESET_PROFILE_FLAG } from "./actionTypes"
import * as actionTypes from "../../actionType"

const initialState = {
  error: null,
  success: null,
  loading: false,
  status: false
}

const profile = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {

    case actionTypes.CHANGE_PASSWORD_REQUEST_SEND:
      return{
        ...state,
        loading: true,
        error: null,
        status: false,
        success: null
      }
      case actionTypes.CHANGE_PASSWORD_REQUEST_SUCCESS:
      return{
        ...state,
        loading: false,
        success: payload,
        status: true
      }
      case actionTypes.CHANGE_PASSWORD_REQUEST_FAIL:
      return{
        ...state,
        loading: false,
        error: payload,
      }

    case EDIT_PROFILE:
     return state = { ...state }
      
    case PROFILE_SUCCESS:
      return state = { ...state, success: action.payload }
     
    case PROFILE_ERROR:
     return  state = { ...state, error: action.payload }
     
    case RESET_PROFILE_FLAG :
     return state = { ...state, success: null }
      
    default:
     return state;
      
  }
 
}

export default profile
