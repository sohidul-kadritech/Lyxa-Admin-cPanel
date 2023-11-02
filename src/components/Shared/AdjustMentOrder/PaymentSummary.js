/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React from 'react';
import FormateBaseCurrency from '../../Common/FormateBaseCurrency';
import FormatesecondaryCurrency from '../../Common/FormatesecondaryCurrency';
import { SummaryItem } from '../OrderDetail/helpers';
import StyledAdjustmentOrderContainer from './StyledAdjustmentOrderContainer';

function AdjustmentPaymentSummary({ order }) {
  const summary = order?.summary;
  const currency = order?.baseCurrency?.symbol;
  const secondaryCurrency = order?.secondaryCurrency?.code;

  const finalCurrency = order?.adminExchangeRate > 0 ? secondaryCurrency : currency;

  //   total base currency amount
  const total_base =
    summary?.baseCurrency_totalAmount +
    summary?.baseCurrency_vat +
    summary?.baseCurrency_riderTip -
    summary?.baseCurrency_discount -
    summary?.reward?.baseCurrency_amount -
    summary?.baseCurrency_couponDiscountAmount;

  //   total secondary currency amount
  const total_secondary =
    summary?.secondaryCurrency_totalAmount +
    summary?.secondaryCurrency_vat +
    summary?.secondaryCurrency_riderTip -
    summary?.secondaryCurrency_discount -
    summary?.reward?.secondaryCurrency_amount -
    summary?.secondaryCurrency_couponDiscountAmount;

  // total base currency discount
  const total_base_discount = summary?.baseCurrency_doubleMenuItemPrice + summary?.baseCurrency_discount;
  // total base currency discount
  const total_secondary_discount = summary?.secondaryCurrency_doubleMenuItemPrice + summary?.secondaryCurrency_discount;

  // average rate
  const avg_rate = total_secondary / total_base;

  //   Base currency refund amount
  const refundBase = order?.userRefundTnx?.reduce((a, b) => a + b?.amount, 0);
  //   secondary currency refund amount
  const refundSecondary = order?.userRefundTnx?.reduce((a, b) => a + b?.secondaryCurrency_amount, 0);
  // base currency cancel amount
  const cancelBase = order?.userCancelTnx?.reduce((a, b) => a + b?.amount, 0);
  // secondary currency cancel amount
  const cancelSecondary = order?.userCancelTnx?.reduce((a, b) => a + b?.secondaryCurrency_amount, 0);

  return (
    <StyledAdjustmentOrderContainer>
      <Box pt={2.5}>
        {order?.isButler ? (
          <SummaryItem
            label="EST item(s) price"
            value={order?.summary?.baseCurrency_productAmount}
            valueSecondary={order?.summary?.secondaryCurrency_productAmount}
            showSecondaryOnly={order?.adminExchangeRate > 0}
            pt={0}
          />
        ) : (
          <SummaryItem
            label="Subtotal"
            value={summary?.baseCurrency_productAmount + summary?.baseCurrency_doubleMenuItemPrice}
            valueSecondary={summary?.secondaryCurrency_productAmount + summary?.secondaryCurrency_doubleMenuItemPrice}
            showSecondaryOnly={order?.adminExchangeRate > 0}
            pt={0}
          />
        )}
        <SummaryItem
          label="Discount"
          value={total_base_discount}
          valueSecondary={total_secondary_discount}
          showSecondaryOnly={order?.adminExchangeRate > 0}
          isNegative
        />

        <SummaryItem
          label="Coupon Discount"
          value={order?.summary?.baseCurrency_couponDiscountAmount}
          valueSecondary={order?.summary?.secondaryCurrency_couponDiscountAmount}
          showSecondaryOnly={order?.adminExchangeRate > 0}
          isNegative
        />

        <SummaryItem
          label="Rewards"
          value={`-${
            order?.adminExchangeRate > 0
              ? FormatesecondaryCurrency.get(Math.abs(order?.summary?.reward?.secondaryCurrency_amount))
              : FormateBaseCurrency.get(Math.abs(order?.summary?.reward?.baseCurrency_amount || 0))
          } ~ ${order?.summary?.reward?.points} Pts`}
          hide={!order?.summary?.reward?.baseCurrency_amount}
          isNegative
        />

        <SummaryItem
          label="Delivery Charge"
          value={order?.summary?.baseCurrency_riderFee > 0 ? order?.summary?.baseCurrency_riderFee : 'FREE'}
          valueSecondary={order?.summary?.secondaryCurrency_riderFee}
          showSecondaryOnly={order?.adminExchangeRate > 0}
        />

        <SummaryItem
          label="VAT"
          value={order?.summary?.baseCurrency_vat}
          valueSecondary={order?.summary?.secondaryCurrency_vat}
          showSecondaryOnly={order?.adminExchangeRate > 0}
          showIfZero
        />

        <SummaryItem label="Total Amount" value={total_base} valueSecondary={total_secondary} showIfZero isTotal />

        <SummaryItem
          label="Cash"
          value={summary?.baseCurrency_cash}
          valueSecondary={summary?.baseCurrency_cash * avg_rate}
          showSecondaryOnly={order?.adminExchangeRate > 0}
          isTotal
        />

        <SummaryItem
          label="Lyxa Pay"
          value={summary?.baseCurrency_wallet}
          valueSecondary={summary?.baseCurrency_wallet * avg_rate}
          showSecondaryOnly={order?.adminExchangeRate > 0}
          isTotal
        />

        <SummaryItem
          label="Card"
          value={summary?.baseCurrency_card}
          valueSecondary={summary?.baseCurrency_card * avg_rate}
          showSecondaryOnly={order?.adminExchangeRate > 0}
          isTotal
        />

        {/* group cart */}
        {order?.cart?.cartType === 'group' && (
          <Box>
            {order?.cart?.cartItems?.map((user) => {
              const summary = user?.summary;

              const total_base_user =
                summary?.baseCurrency_wallet + summary?.baseCurrency_card + summary?.baseCurrency_cash;
              // const total_base_user =
              //   summary?.baseCurrency_totalAmount +
              //   summary?.baseCurrency_vat +
              //   summary?.baseCurrency_riderTip -
              //   summary?.baseCurrency_discount -
              //   summary?.reward?.baseCurrency_amount -
              //   summary?.baseCurrency_couponDiscountAmount;

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
        {/* {!order?.isButler && order?.userCancelTnx?.length ? (
          <SummaryItem
            label="Total Refunded"
            value={cancelBase}
            valueSecondary={cancelSecondary}
            showIfZero
            isTotal
            pb={0}
          />
        ) : null} */}

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
    </StyledAdjustmentOrderContainer>
  );
}

export default AdjustmentPaymentSummary;
