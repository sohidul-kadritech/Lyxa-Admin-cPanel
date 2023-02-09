export const TrxType = (type) => {
  let newType = '';
  if (type === 'adminSettlebalanceShop') {
    newType = 'Settle shop';
  } else if (type === 'adminAddBalanceShop') {
    newType = 'Add shop credit';
  } else if (type === 'sellerCashInHandAdjust') {
    newType = 'Adjust hand cash';
  } else if (type === 'adminRemoveBalanceShop') {
    newType = 'Remove shop credit';
  } else if (type === 'deliveryBoyAmountSettle') {
    newType = 'Settle Rider';
  } else if (type === 'deliveryBoyAdminAmountReceivedCash') {
    newType = 'Received rider cash';
  } else if (type === 'deliveryBoyOrderDeliveredCash') {
    newType = 'Order Delivered Cash';
  } else {
    newType = 'Unknown';
  }

  return newType;
};
