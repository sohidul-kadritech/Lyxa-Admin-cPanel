export const getPayoutStatusLabel = (payout) => {
  const status = {
    revoked: 'Unpaid',
    adjusted: 'Unpaid ⚠',
    unpaid: 'Unpaid',
    paid: 'Paid',
    overdue: 'Over Due',
  };

  if (payout?.isPayoutAdjusted) {
    return status.adjusted;
  }

  return status[payout?.payoutStatus];
};
