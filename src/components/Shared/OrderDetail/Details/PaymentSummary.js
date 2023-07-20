/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function PaymentDetails({ order = {} }) {
  const refund = order?.userRefundTnx?.length ? order?.userRefundTnx[0] : {};
  const cancel = order?.userCancelTnx?.length ? order?.userCancelTnx[0] : {};
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;

  const currency = order?.baseCurrency?.symbol;
  const secondaryCurrency = order?.secondaryCurrency?.code;
  const shopExchangeRate = order?.shopExchangeRate;
  const adminExchangeRate = order?.adminExchangeRate;

  return (
    <StyledOrderDetailBox title="Payment Summary">
      <Box pt={2.5}>
        <SummaryItem label="Subtotal" value={order?.summary?.productAmount} showIfZero pt={0} />

        <SummaryItem
          label="Delivery fee"
          value={order?.summary?.deliveryFee > 0 ? order?.summary?.deliveryFee : 'FREE'}
          exchangeRate={order?.shop?.haveOwnDeliveryBoy ? shopExchangeRate : adminExchangeRate}
        />
        <SummaryItem label="Rider Tips" value={order?.summary?.riderTip} />
        <SummaryItem label="Discount" value={order?.summary?.discount} isNegative />

        <SummaryItem
          label="Coupon Discount"
          value={order?.summary?.couponDiscountAmount}
          isNegative
          exchangeRate={adminExchangeRate}
        />

        <SummaryItem
          label="Rewards"
          value={`${currency} ${(order?.summary?.reward?.amount / shopExchangeRate || 0).toFixed(2)} = ${
            order?.summary?.reward?.points
          } Pts`}
          hide={!order?.summary?.reward?.amount}
        />

        <SummaryItem label="VAT" value={order?.summary?.vat} showIfZero />

        <SummaryItem
          label="Total"
          value={`${secondaryCurrency} ${totalPayment || 0} ~ ${currency} ${(
            totalPayment / shopExchangeRate || 0
          ).toFixed(2)}`}
          showIfZero
          isTotal
        />

        {/* group cart */}
        {order?.cart?.cartType === 'group' && (
          <Box>
            {order?.cart?.cartItems?.map((user) => {
              const total = user?.isPaid ? user?.summary?.cash + user?.summary?.wallet + user?.summary?.card || 0 : 0;
              return <SummaryItem key={user?.user?._id} label={user?.user?.name} value={total} isTotal />;
            })}
          </Box>
        )}

        <SummaryItem
          label="Total Refunded"
          value={`${secondaryCurrency} ${refund?.amount || 0} ~ ${currency} ${(
            refund?.amount / shopExchangeRate || 0
          ).toFixed(2)}`}
          isTotal
          hide={!order?.isRefundedAfterDelivered}
          pb={0}
        />

        <SummaryItem
          label="Total Refunded"
          value={`${secondaryCurrency} ${cancel?.amount || 0} ~ ${currency} ${(
            cancel?.amount / shopExchangeRate || 0
          ).toFixed(2)}`}
          hide={order?.orderStatus !== 'cancelled'}
          isTotal
          pb={0}
        />
      </Box>
    </StyledOrderDetailBox>
  );
}
