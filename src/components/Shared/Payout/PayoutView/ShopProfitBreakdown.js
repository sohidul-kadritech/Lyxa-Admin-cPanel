/* eslint-disable prettier/prettier */
import { Stack } from '@mui/material';
import { getTotalProfit } from '../../FinancialsOverview/helpers';
import { InfoCardForPayout } from './InfoCardForPayout';

export function ShopProfitBreakdown({ currentPayout, currency, secondaryCurrency }) {
  console.log('currentPayout?.info.profitBreakdown', currentPayout?.info.profitBreakdown);

  const profitBreakdown = currentPayout?.info.profitBreakdown;
  const cash = profitBreakdown?.cash;
  const online = profitBreakdown?.online;
  const lyxaMarketingCashback = profitBreakdown?.AdminMarketingCashback;
  const otherPayments = profitBreakdown?.otherPayments;
  const deliveryFee = profitBreakdown?.deliveryFee;

  const totalProfitJoin = getTotalProfit(
    currency,
    secondaryCurrency,
    profitBreakdown,
    true,
  ).joinBaseAndSecondaryCurrency;

  const totalProfitJoinWithoutBrack = getTotalProfit(
    currency,
    secondaryCurrency,
    profitBreakdown,
    true,
  ).joinBaseAndSecondaryCurrencyWithoutBrackets;

  const totalProfitBase = getTotalProfit(currency, secondaryCurrency, profitBreakdown, true).onlyBaseCurrency;

  return (
    <Stack>
      <InfoCardForPayout
        title="Order Amount"
        currency={currency}
        value={Math.abs(profitBreakdown?.orderAmount || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Cash"
        isExpandable
        expandSx="16px"
        currency={currency}
        value={Math.abs(cash?.totalCash || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Original Order Amount"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.originalOrderAmount_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Discount"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.cash?.discount_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Buy 1 Get 1"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.buy1Get1_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Loyalty Points"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.loyaltyPoints_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Coupons"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(cash?.couponDiscount_cash || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Online"
        isExpandable
        expandSx="16px"
        currency={currency}
        value={Math.abs(online?.totalOnline || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Original Order Amount"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.originalOrderAmount_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Discount"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.discount_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Buy 1 Get 1"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.buy1Get1_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Loyalty Points"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.loyaltyPoints_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Coupons"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(online?.couponDiscount_online || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Lyxa Marketing Compensation"
        isNegative
        currency={currency}
        value={Math.abs(lyxaMarketingCashback?.adminMarketingCashback || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Lyxa fees"
        currency={currency}
        value={Math.abs(profitBreakdown?.adminFees || 0).toFixed(2)}
        isNegative
      />
      <InfoCardForPayout
        title="Lyxa Points cashback"
        currency={currency}
        value={Math.abs(profitBreakdown?.pointsCashback || 0).toFixed(2)}
        isNegative
      />

      <InfoCardForPayout
        title="Other Payments"
        currency={currency}
        value={Math.abs(otherPayments?.totalOtherPayments || 0).toFixed(2)}
        isNegative={otherPayments?.totalOtherPayments >= 0}
      />

      <InfoCardForPayout
        title="Promotion: Free delivery"
        currency={currency}
        isExpandable
        expandSx="16px"
        value={Math.abs(otherPayments?.freeDeliveryByShop || 0).toFixed(2)}
        isNegative
      />
      <InfoCardForPayout
        title="Promotion: Featured"
        currency={currency}
        value={Math.abs(otherPayments?.featuredAmount || 0).toFixed(2)}
        isExpandable
        expandSx="16px"
        isNegative
      />
      <InfoCardForPayout
        title="Error Charge"
        currency={currency}
        value={Math.abs(otherPayments?.errorCharge || 0).toFixed(2)}
        isExpandable
        expandSx="16px"
        isNegative
      />
      <InfoCardForPayout
        title="Shop add/remove credit"
        currency={currency}
        value={Math.abs(otherPayments?.shopAddRemoveCredit || 0).toFixed(2)}
        isExpandable
        expandSx="16px"
        isNegative={otherPayments?.shopAddRemoveCredit < 0}
      />
      <InfoCardForPayout
        title="Refunded Amount"
        currency={currency}
        value={Math.abs(otherPayments?.customerRefund || 0).toFixed(2)}
        isExpandable
        expandSx="16px"
        isNegative
      />
      <InfoCardForPayout
        title="Total VAT"
        currency={currency}
        value={Math.abs(profitBreakdown?.totalVat || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Delivery fee"
        currency={currency}
        value={Math.abs(deliveryFee?.deliveryFee || 0).toFixed(2)}
      />
      <InfoCardForPayout
        title="Cash"
        isExpandable
        expandSx="16px"
        currency={currency}
        value={Math.abs(deliveryFee?.cash || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Online"
        isExpandable
        expandSx="16px"
        currency={currency}
        value={Math.abs(deliveryFee?.online || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Delivery fee"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(deliveryFee?.online || 0).toFixed(2)}
      />

      <InfoCardForPayout
        title="Rider tip"
        isExpandable
        expandSx="24px"
        currency={currency}
        value={Math.abs(deliveryFee?.riderTip_online || 0).toFixed(2)}
      />
      <InfoCardForPayout title="Total Payouts" value={`${totalProfitJoin} ${totalProfitBase}`} />

      <Stack maxWidth="450px" mt={36 / 4}>
        <InfoCardForPayout
          sx={{ borderBottom: 'none' }}
          title="Sub Total"
          // currency={currency}
          value={`${totalProfitJoinWithoutBrack} `}
        />

        <InfoCardForPayout
          title="Cash in Hand"
          value={`${currency} ${(profitBreakdown?.baseCurrency_shopCashInHand || 0).toFixed(
            2,
          )} + ${secondaryCurrency} ${profitBreakdown?.secondaryCurrency_shopCashInHand}`}
        />

        <InfoCardForPayout
          sx={{ borderBottom: 'none' }}
          title="Total Payout"
          value={`${currency} ${(profitBreakdown?.baseCurrency_Amount || 0).toFixed(2)} + ${secondaryCurrency} ${
            profitBreakdown?.secondaryCurrency_Amount
          }`}
        />
      </Stack>
    </Stack>
  );
}
