/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import React from 'react';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function ProfitDetails({ order = {} }) {
  const currency = order?.baseCurrency?.symbol;
  const adminExchangeRate = order?.adminExchangeRate;
  const summary = order?.summary;

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

  let hideExtraFields = false;
  let cashCanceled = false;
  let noRefund = false;

  if (
    order?.orderStatus === 'cancelled' &&
    !order?.userCancelTnx?.length &&
    !order?.isRefundedAfterDelivered &&
    order?.refundType !== 'none'
  ) {
    hideExtraFields = true;
    cashCanceled = true;
  }

  if (order?.refundType === 'none') {
    hideExtraFields = true;
    noRefund = true;
  }

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <SummaryItem label="Total Order Amount" value={total_base} valueSecondary={total_secondary} showIfZero />

        <SummaryItem
          label="Loyalty Points"
          value={
            order?.rewardRedeemCut?.baseCurrency_rewardAdminCut + order?.rewardRedeemCut?.baseCurrency_rewardShopCut
          }
          valueSecondary={
            order?.rewardRedeemCut?.secondaryCurrency_rewardAdminCut +
            order?.rewardRedeemCut?.secondaryCurrency_rewardShopCut
          }
          tooltip={
            <Box>
              <span>Total Loyalty Points cut from lyxa and shop</span>
              <ul
                style={{
                  padding: '4px 16px',
                  marginBottom: '0',
                  minWidth: '180px',
                }}
              >
                <li>
                  Applied by lyxa {currency} {order?.rewardRedeemCut?.baseCurrency_rewardAdminCut || 0}
                </li>
                <li>
                  Applied by shop {currency} {order?.rewardRedeemCut?.baseCurrency_rewardShopCut || 0}
                </li>
              </ul>
            </Box>
          }
          hide={hideExtraFields}
        />

        <SummaryItem
          label="Buy 1 Get 1 (admin)"
          value={order?.doubleMenuItemPrice?.baseCurrency_doubleMenuItemPriceAdmin}
          valueSecondary={order?.doubleMenuItemPrice?.secondaryCurrency_doubleMenuItemPriceAdmin}
          tooltip="Buy 1 Get 1 deal added by admin"
          hide={hideExtraFields}
        />

        <SummaryItem
          label="Buy 1 Get 1 (shop)"
          value={order?.doubleMenuItemPrice?.baseCurrency_doubleMenuItemPriceShop}
          valueSecondary={order?.doubleMenuItemPrice?.secondaryCurrency_doubleMenuItemPriceShop}
          tooltip="Buy 1 Get 1 deal added by shop"
          hide={hideExtraFields}
        />

        <SummaryItem
          label="Discount (admin)"
          value={order?.discountCut?.baseCurrency_discountAdminCut}
          valueSecondary={order?.discountCut?.secondaryCurrency_discountAdminCut}
          tooltip="Discount deal added by admin"
          hide={hideExtraFields}
        />

        <SummaryItem
          label="Discount (shop)"
          value={order?.discountCut?.baseCurrency_discountShopCut}
          valueSecondary={order?.discountCut?.secondaryCurrency_discountShopCut}
          tooltip="Discount deal added by shop"
          hide={hideExtraFields}
        />

        <SummaryItem
          label="Free Delivery (admin)"
          value={order?.orderDeliveryCharge?.dropCut}
          valueSecondary={order?.orderDeliveryCharge?.dropCut * adminExchangeRate}
          tooltip="Free Delivery added by admin"
          hide={hideExtraFields}
        />

        <SummaryItem
          label="Free Delivery (shop)"
          value={order?.orderDeliveryCharge?.shopCut}
          valueSecondary={order?.orderDeliveryCharge?.shopCut * adminExchangeRate}
          tooltip="Free Delivery added by shop"
          hide={hideExtraFields}
        />

        <SummaryItem
          label="Coupon Discount"
          value={order?.summary?.baseCurrency_couponDiscountAmount}
          valueSecondary={order?.summary?.secondaryCurrency_couponDiscountAmount}
          tooltip="Discount coupon created by admin"
          hide={hideExtraFields}
        />

        {/* not needed for butler order */}
        {!order?.isButler && (
          <Box pt={3.5} borderTop="1px solid #EEEEEE">
            <SummaryItem
              label="Shop Profit"
              value={hideExtraFields ? 0 : order?.baseCurrency_shopEarnings}
              valueSecondary={hideExtraFields ? 0 : order?.secondaryCurrency_shopEarnings}
              showIfZero
            />

            <SummaryItem
              label="Shop VAT"
              value={hideExtraFields ? 0 : order?.vatAmount?.baseCurrency_vatForShop}
              valueSecondary={hideExtraFields ? 0 : order?.vatAmount?.secondaryCurrency_vatForShop}
              showIfZero
            />

            <SummaryItem
              label="Deal compensation amount"
              value={hideExtraFields ? 0 : order?.doubleMenuCut?.baseCurrency_doubleMenuAdminCut}
              valueSecondary={hideExtraFields ? 0 : order?.doubleMenuCut?.secondaryCurrency_doubleMenuAdminCut}
              tooltip="This amount in already included in shop profit"
              isRejected
            />
          </Box>
        )}

        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <SummaryItem
            label="Rider Profit"
            value={order?.shop?.haveOwnDeliveryBoy ? 'Self' : hideExtraFields ? 0 : order?.baseCurrency_riderFee || 0}
            valueSecondary={
              order?.shop?.haveOwnDeliveryBoy ? 'Self' : hideExtraFields ? 0 : order?.secondaryCurrency_riderFee || 0
            }
            showIfZero
          />
        </Box>

        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <SummaryItem
              label="Lyxa Delivery Profit"
              value={hideExtraFields ? 0 : order?.adminCharge?.baseCurrency_adminChargeFromDelivery}
              valueSecondary={hideExtraFields ? 0 : order?.adminCharge?.secondaryCurrency_adminChargeFromDelivery}
              showIfZero
            />
          )}

          <SummaryItem
            label="Lyxa Order Profit"
            value={hideExtraFields ? 0 : order?.adminCharge?.baseCurrency_adminChargeFromOrder}
            valueSecondary={hideExtraFields ? 0 : order?.adminCharge?.secondaryCurrency_adminChargeFromOrder}
            showIfZero
          />

          <SummaryItem
            label="Deal compensation amount"
            value={
              hideExtraFields
                ? 0
                : order?.doubleMenuCut?.baseCurrency_doubleMenuShopCut + order?.orderDeliveryCharge?.shopCut
            }
            valueSecondary={
              hideExtraFields
                ? 0
                : order?.doubleMenuCut?.secondaryCurrency_doubleMenuShopCut +
                  order?.orderDeliveryCharge?.shopCut * adminExchangeRate
            }
            tooltip="This amount already in included lyxa profit"
            isRejected
            hide={hideExtraFields}
          />
        </Box>

        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          {/* for delivered orders */}
          <SummaryItem
            label="Total Lyxa Profit"
            value={order?.adminCharge?.baseCurrency_totalAdminCharge}
            valueSecondary={order?.adminCharge?.secondaryCurrency_totalAdminCharge}
            hide={hideExtraFields}
            showIfZero
            isTotal
          />

          {/* for cash+canceled orders */}
          <SummaryItem label="Total Lyxa Profit" value={0} valueSecondary={0} hide={!cashCanceled} showIfZero isTotal />

          {/* for no refund orders */}
          <SummaryItem
            label="Total Lyxa Profit"
            value={total_base}
            valueSecondary={total_secondary}
            hide={!noRefund}
            showIfZero
            isTotal
          />

          {/* for delivered orders */}
          <SummaryItem
            label="Lyxa VAT"
            value={order?.vatAmount?.baseCurrency_vatForAdmin}
            valueSecondary={order?.vatAmount?.secondaryCurrency_vatForAdmin}
            hide={hideExtraFields}
            showIfZero
            pb={0}
          />

          {/* for cash+canceled orders */}
          <SummaryItem label="Lyxa VAT" value={0} valueSecondary={0} hide={!cashCanceled} showIfZero />

          {/* for no refund orders */}
          <SummaryItem
            label="Lyxa VAT"
            value={order?.summary?.baseCurrency_vat}
            valueSecondary={order?.summary?.secondaryCurrency_vat}
            hide={!noRefund}
            showIfZero
          />

          <SummaryItem label="Refund Type" value="None" isTotal pb={0} hide={!hideExtraFields} />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
