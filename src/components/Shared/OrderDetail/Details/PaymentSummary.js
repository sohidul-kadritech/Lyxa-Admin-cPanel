/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function PaymentSummary({ order = {} }) {
  const refund = order?.userRefundTnx?.[0];
  const cancel = order?.userCancelTnx?.[0];

  const total_base =
    order?.summary?.baseCurrency_cash + order?.summary?.baseCurrency_wallet + order?.summary?.baseCurrency_card || 0;

  const total_secondary =
    order?.summary?.secondaryCurrency_cash +
      order?.summary?.secondaryCurrency_wallet +
      order?.summary?.secondaryCurrency_card || 0;

  const currency = order?.baseCurrency?.symbol;
  const adminExchangeRate = order?.adminExchangeRate;

  return (
    <StyledOrderDetailBox title="Payment Summary">
      <Box pt={2.5}>
        <SummaryItem
          label="Subtotal"
          value={order?.summary?.baseCurrency_productAmount}
          valueSecondary={order?.summary?.secondaryCurrency_productAmount}
          pt={0}
        />

        <SummaryItem
          label="Delivery fee"
          value={order?.summary?.baseCurrency_riderFee > 0 ? order?.summary?.baseCurrency_riderFee : 'FREE'}
          valueSecondary={order?.summary?.secondaryCurrency_riderFee}
        />

        <SummaryItem
          label="Rider Tips"
          value={order?.summary?.baseCurrency_riderTip}
          valueSecondary={order?.summary?.secondaryCurrency_riderTip}
        />

        <SummaryItem
          label="Discount"
          value={order?.summary?.baseCurrency_discount}
          valueSecondary={order?.summary?.secondaryCurrency_discount}
          isNegative
        />

        <SummaryItem
          label="Coupon Discount"
          value={order?.summary?.baseCurrency_couponDiscountAmount}
          valueSecondary={order?.summary?.secondaryCurrency_couponDiscountAmount}
          isNegative
        />

        <SummaryItem
          label="Rewards"
          value={`${currency} ${(order?.summary?.reward?.baseCurrency_amount || 0).toFixed(2)} = ${
            order?.summary?.reward?.points
          } Pts`}
          hide={!order?.summary?.reward?.baseCurrency_amount}
        />

        <SummaryItem
          label="VAT"
          value={order?.summary?.baseCurrency_vat}
          valueSecondary={order?.summary?.secondaryCurrency_vat}
          showIfZero
        />

        <SummaryItem label="Total" value={total_base} valueSecondary={total_secondary} showIfZero isTotal />

        {/* group cart */}
        {order?.cart?.cartType === 'group' && (
          <Box>
            {order?.cart?.cartItems?.map((user) => {
              const total_base_user = user?.isPaid
                ? user?.summary?.baseCurrency_cash +
                    user?.summary?.baseCurrency_wallet +
                    user?.summary?.baseCurrency_card || 0
                : 0;
              return <SummaryItem key={user?.user?._id} label={user?.user?.name} value={total_base_user} isTotal />;
            })}
          </Box>
        )}

        <SummaryItem
          label="Total Refunded"
          value={refund?.amount}
          isTotal
          hide={!order?.isRefundedAfterDelivered}
          showIfZero
          showBaseOnly
          pb={0}
        />

        <SummaryItem
          label="Total Refunded"
          value={cancel?.amount}
          exchangeRate={adminExchangeRate}
          hide={order?.orderStatus !== 'cancelled'}
          showBaseOnly
          showIfZero
          isTotal
          pb={0}
        />

        {/* <SummaryItem
          label="Total Refunded"
          value={0}
          isTotal
          pb={0}
          hide={!isCashAndCancelled}
          showBaseOnly
          showIfZero
        /> */}
      </Box>
    </StyledOrderDetailBox>
  );
}
