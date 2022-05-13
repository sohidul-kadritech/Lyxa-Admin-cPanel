import * as actionType from "../actionType";

const initialState = {
  loading: false,
  status: false,
  error: null,
};

const adminSettingsReducer = (state = initialState, actionType) => {
  const { type, payload } = actionType;

  switch (type) {

    default:
      return state;
  }
};

export default adminSettingsReducer;
