import { successMsg } from '../../../helpers/successMsg';

/* eslint-disable no-unused-vars */
export const getPayoutData = (data) => {
  const template = {
    name: '',
    autoGenId: '',
    image: '',
    route: '',
    type: '',
    totalAmount: 0,
    address: '',
    info: {},
  };

  const shopData = data?.shop;

  const riderData = data?.deliveryBoy;

  if (shopData) {
    template.name = shopData?.shopName;
    template.autoGenId = shopData?.autoGenId;
    template.image = shopData?.shopLogo;
    template.route = `/shop/profile/${shopData?._id}`;
    template.type = 'Shop';
    template.address = shopData?.address?.address;
    template.totalAmount = shopData?.profitBreakdown?.totalAmount;
    template.info = { ...data };
    return template;
  }

  if (riderData) {
    template.name = riderData?.name;
    template.autoGenId = riderData?.autoGenId;
    template.image = riderData?.image;
    template.route = `/riders/${riderData?._id}`;
    template.type = 'Rider';
    template.address = riderData?.address;
    template.totalAmount = riderData?.profitBreakdown?.riderPayout;
    template.info = { ...data };
    return template;
  }

  return template;
};

export const validatePaidPayout = (data) => {
  const forShopPayout = {
    payoutId: data?._id,
    baseCurrency_payoutPaidAmount: data?.profitBreakdown?.baseCurrency_Amount,
    baseCurrency_payoutPaidAmount_sc: data?.profitBreakdown?.baseCurrency_Amount_sc,
    secondaryCurrency_payoutPaidAmount: data?.profitBreakdown?.secondaryCurrency_Amount,
    secondaryCurrency_payoutPaidAmount_bc: data?.profitBreakdown?.secondaryCurrency_Amount_bc,
  };

  const forRider = {
    baseCurrency: {
      payoutId: data?._id,
      baseCurrency_payoutPaidAmount: data?.profitBreakdown?.baseCurrency_riderPayout,
      baseCurrency_payoutPaidAmount_sc: data?.profitBreakdown?.secondaryCurrency_riderPayout,
      baseCurrency_riderTip: data?.profitBreakdown?.baseCurrency_riderTips,
      secondaryCurrency_riderTip: data?.profitBreakdown?.secondaryCurrency_riderTips,
    },
    secondaryCurrency: {
      payoutId: data?._id,
      secondaryCurrency_payoutPaidAmount: data?.profitBreakdown?.secondaryCurrency_riderPayout,
      secondaryCurrency_payoutPaidAmount_bc: data?.profitBreakdown?.baseCurrency_riderPayout,
      baseCurrency_riderTip: data?.profitBreakdown?.baseCurrency_riderTips,
      secondaryCurrency_riderTip: data?.profitBreakdown?.secondaryCurrency_riderTips,
    },
  };

  if (!data?._id) {
    successMsg('Select a payout first', 'warn');
    return { status: false };
  }

  if (data?.payoutAccount === 'shop') {
    return { status: true, data: { ...forShopPayout } };
  }

  if (data?.payoutAccount === 'deliveryBoy') {
    return { status: true, data: { ...forRider[data?.profitBreakdown?.currency] } };
  }

  successMsg('Payout data is not valid', 'warn');

  return { status: false };
};
