export const currentUserInit = {
  shop: {},
  seller: {},
  admin: {},
  userType: null,
  adminType: null,
};

export const currentUserReducer = (state, { type, payload }) => {
  console.log('=========>', type, payload);

  switch (type) {
    case 'shop':
      return {
        ...state,
        shop: payload.shop,
        userType: 'shop',
      };

    case 'seller':
      return {
        ...state,
        seller: payload.seller,
        userType: 'seller',
      };

    case 'admin':
      return {
        ...state,
        admin: payload.admin,
        userType: 'admin',
        adminType: payload.admin?.adminType,
      };

    default:
      return state;
  }
};
