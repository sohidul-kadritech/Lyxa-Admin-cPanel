export const isDeliveryProfitIsVisible = (type) => {
  const types = {
    adminFinancials: false,
    delivery: false,
  };

  return types[type];
};
