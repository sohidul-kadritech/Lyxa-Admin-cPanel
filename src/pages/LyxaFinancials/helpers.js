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

export const bothCurrencyProfitbreakDown = (data, type) => {
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
  /* for lxya summary */

  if (type === 'total_profit') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_profit || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_profit || 0;
    template.totalAdminProfit = data?.totalProfit || 0;
    return template;
  }

  if (type === 'total_order_profit') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_orderProfit || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_orderProfit || 0;
    template.totalAdminProfit = data?.totalOrderProfit || 0;

    return template;
  }

  if (type === 'total_delivery_profit') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_deliveryProfit || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_deliveryProfit || 0;
    template.totalAdminProfit = data?.totalDeliveryProfit || 0;

    return template;
  }

  if (type === 'total_refund') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_refund || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_refund || 0;
    template.totalAdminProfit = data?.totalRefund || 0;

    return template;
  }
  if (type === 'total_marketing_spent') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_marketingSpent || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_marketingSpent || 0;
    template.totalAdminProfit = data?.totalMarketingSpent || 0;

    return template;
  }

  if (type === 'featured') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_featuredAmount || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_featuredAmount || 0;
    template.totalAdminProfit = data?.totalFeaturedAmount || 0;

    return template;
  }

  if (type === 'otherAmount') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_otherAmount || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_otherAmount || 0;
    template.totalAdminProfit = data?.otherAmount || 0;

    return template;
  }

  if (type === 'free_delivery') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_freeDeliveryShopCut || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_freeDeliveryShopCut || 0;
    template.totalAdminProfit = data?.freeDeliveryShopCut || 0;

    return template;
  }

  if (type === 'lyxa_pay') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_adminPay || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_adminPay || 0;
    template.totalAdminProfit = data?.adminPay || 0;

    return template;
  }

  if (type === 'add_remove_credit') {
    template.secondaryCurrency_adminProfit = data?.secondaryCurrency_addRemoveCredit || 0;
    template.baseCurrency_adminProfit = data?.baseCurrency_addRemoveCredit || 0;
    template.totalAdminProfit = data?.totalAddRemoveCredit || 0;

    return template;
  }

  return template;
};
