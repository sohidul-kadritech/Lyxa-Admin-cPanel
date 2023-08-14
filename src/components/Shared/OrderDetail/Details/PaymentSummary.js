/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function PaymentSummary({ order = {} }) {
  const summary = order?.summary;
  const currency = order?.baseCurrency?.symbol;

  const total_base =
    summary?.baseCurrency_totalAmount +
    summary?.baseCurrency_vat +
    summary?.baseCurrency_riderTip -
    summary?.baseCurrency_discount -
    summary?.reward?.baseCurrency_amount -
    summary?.baseCurrency_couponDiscountAmount;

  const total_secondary =
    summary?.secondaryCurrency_totalAmount +
    summary?.secondaryCurrency_vat +
    summary?.secondaryCurrency_riderTip -
    summary?.secondaryCurrency_discount -
    summary?.reward?.secondaryCurrency_amount -
    summary?.secondaryCurrency_couponDiscountAmount;

  const avg_rate = total_secondary / total_base;

  const refundBase = order?.userRefundTnx?.reduce((a, b) => a + b?.amount, 0);
  const refundSecondary = order?.userRefundTnx?.reduce((a, b) => a + b?.secondaryCurrency_amount, 0);

  const cancelBase = order?.userCancelTnx?.reduce((a, b) => a + b?.amount, 0);
  const cancelSecondary = order?.userCancelTnx?.reduce((a, b) => a + b?.secondaryCurrency_amount, 0);

  // const refund_amount = refund || cancel;
  // const refund_amount_secondary = refund ? refundSecondary : cancel;

  return (
    <StyledOrderDetailBox title="Payment Summary">
      <Box pt={2.5}>
        <SummaryItem
          label={order?.isButler ? 'EST item(s) price' : 'Subtotal'}
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

        <SummaryItem
          label="Cash"
          value={summary?.baseCurrency_cash}
          valueSecondary={summary?.baseCurrency_cash * avg_rate}
          isTotal
        />

        <SummaryItem
          label="Card"
          value={summary?.baseCurrency_card}
          valueSecondary={summary?.baseCurrency_card * avg_rate}
          isTotal
        />

        <SummaryItem
          label="Wallet"
          value={summary?.baseCurrency_wallet}
          valueSecondary={summary?.baseCurrency_wallet * avg_rate}
          isTotal
        />

        {/* group cart */}
        {order?.cart?.cartType === 'group' && (
          <Box>
            {order?.cart?.cartItems?.map((user) => {
              const summary = user?.summary;

              const total_base_user =
                summary?.baseCurrency_totalAmount +
                summary?.baseCurrency_vat +
                summary?.baseCurrency_riderTip -
                summary?.baseCurrency_discount -
                summary?.reward?.baseCurrency_amount -
                summary?.baseCurrency_couponDiscountAmount;

              return (
                <SummaryItem
                  key={user?.user?._id}
                  label={user?.user?.name}
                  value={total_base_user}
                  showBaseOnly
                  isTotal
                />
              );
            })}
          </Box>
        )}

        {/* normal order refund */}
        {!order?.isButler && order?.userRefundTnx?.length ? (
          <SummaryItem
            label="Total Refunded"
            value={refundBase}
            valueSecondary={refundSecondary}
            showIfZero
            isTotal
            pb={0}
          />
        ) : null}

        {/* normal order user cancel */}
        {!order?.isButler && order?.userCancelTnx?.length ? (
          <SummaryItem
            label="Total Refunded"
            value={cancelBase}
            valueSecondary={cancelSecondary}
            showIfZero
            isTotal
            pb={0}
          />
        ) : null}

        {/* butler refund */}
        {order?.isButler && (order?.orderCancel || order?.userCancelTnx?.length) ? (
          <SummaryItem
            label="Total Refunded"
            value={total_base}
            valueSecondary={total_secondary}
            showIfZero
            isTotal
            pb={0}
          />
        ) : null}
      </Box>
    </StyledOrderDetailBox>
  );
}
