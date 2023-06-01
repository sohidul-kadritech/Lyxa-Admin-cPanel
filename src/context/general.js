export const generalInit = {
  currency: {
    symbol: '€',
    name: 'Euro',
    symbol_native: '€',
    decimal_digits: 2,
    rounding: 0,
    code: 'EUR',
    name_plural: 'euros',
  },
};

export const generalReducer = (state, { type, payload }) => {
  switch (type) {
    case 'currency':
      return {
        ...state,
        currency: payload.currency,
      };

    default:
      return state;
  }
};
