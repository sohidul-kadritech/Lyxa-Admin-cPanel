export const isDeliveryProfitIsVisible = (type) => {
  const types = {
    adminFinancials: false,
    delivery: false,
  };

  return types[type];
};

/*
secondaryCurrency_adminProfit
baseCurrency_adminProfit
totalAdminProfit
*/

export const modifiedProfitBreakDownDataForSecondaryCurrency = (data, type) => {
  const template = {
    secondaryCurrency_adminProfit: 0,
    baseCurrency_adminProfit: 0,
    totalAdminProfit: 0,
  };

  if (type === 'shop') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_adminProfit || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_adminProfit || 0;
    template.totalAdminProfit = data?.totalAdminProfit || 0;

    return template;
  }
  if (type === 'butler') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_adminButlerProfit || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_adminButlerProfit || 0;
    template.totalAdminProfit = data?.adminButlerProfit || 0;

    return template;
  }

  if (type === 'delivery') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_adminDeliveryProfit || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_adminDeliveryProfit || 0;
    template.totalAdminProfit = data?.adminDeliveryProfit || 0;

    return template;
  }

  return template;
};
