export const currentUserInit = {
  shop: {},
  seller: {},
  admin: {},
  userType: null,
};

export const currentUserReducer = (state, { type, payload }) => {
  console.log('=========>', type, payload);

  switch (type) {
    case 'shop':
      return {
        ...state,
        shop: payload.shop,
      };

    case 'seller':
      return {
        ...state,
        seller: payload.seller,
      };

    case 'admin':
      return {
        ...state,
        admin: payload.admin,
      };

    default:
      return state;
  }
};
