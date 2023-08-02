/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import React from 'react';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function ProfitDetails({ order = {} }) {
  const currency = order?.baseCurrency?.symbol;
  const adminExchangeRate = order?.adminExchangeRate;

  const total_base =
    order?.summary?.baseCurrency_cash + order?.summary?.baseCurrency_wallet + order?.summary?.baseCurrency_card || 0;

  const total_secondary =
    order?.summary?.secondaryCurrency_cash +
      order?.summary?.secondaryCurrency_wallet +
      order?.summary?.secondaryCurrency_card || 0;

  const isCashAndCancelled =
    order?.orderStatus === 'cancelled' && !order?.userCancelTnx?.length && !order?.isRefundedAfterDelivered;

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
          hide={isCashAndCancelled}
        />

        <SummaryItem
          label="Buy 1 Get 1 (admin)"
          value={order?.doubleMenuItemPrice?.baseCurrency_doubleMenuItemPriceAdmin}
          valueSecondary={order?.doubleMenuItemPrice?.secondaryCurrency_doubleMenuItemPriceAdmin}
          tooltip="Buy 1 Get 1 deal added by admin"
          hide={isCashAndCancelled}
        />

        <SummaryItem
          label="Buy 1 Get 1 (shop)"
          value={order?.doubleMenuItemPrice?.baseCurrency_doubleMenuItemPriceShop}
          valueSecondary={order?.doubleMenuItemPrice?.secondaryCurrency_doubleMenuItemPriceShop}
          tooltip="Buy 1 Get 1 deal added by shop"
          hide={isCashAndCancelled}
        />

        <SummaryItem
          label="Discount (admin)"
          value={order?.discountCut?.baseCurrency_discountAdminCut}
          valueSecondary={order?.discountCut?.secondaryCurrency_discountAdminCut}
          tooltip="Discount deal added by admin"
          hide={isCashAndCancelled}
        />

        <SummaryItem
          label="Discount (shop)"
          value={order?.discountCut?.baseCurrency_discountShopCut}
          valueSecondary={order?.discountCut?.secondaryCurrency_discountShopCut}
          tooltip="Discount deal added by shop"
          hide={isCashAndCancelled}
        />

        <SummaryItem
          label="Free Delivery (admin)"
          value={order?.orderDeliveryCharge?.dropCut}
          valueSecondary={order?.orderDeliveryCharge?.dropCut * adminExchangeRate}
          tooltip="Free Delivery added by admin"
          hide={isCashAndCancelled}
        />

        <SummaryItem
          label="Free Delivery (shop)"
          value={order?.orderDeliveryCharge?.shopCut}
          valueSecondary={order?.orderDeliveryCharge?.shopCut * adminExchangeRate}
          tooltip="Free Delivery added by shop"
          hide={isCashAndCancelled}
        />

        <SummaryItem
          label="Coupon Discount"
          value={order?.summary?.baseCurrency_couponDiscountAmount}
          valueSecondary={order?.summary?.secondaryCurrency_couponDiscountAmount}
          tooltip="Discount coupon created by admin"
          hide={isCashAndCancelled}
        />

        {/* not needed for butler order */}
        {!order?.isButler && (
          <Box pt={3.5} borderTop="1px solid #EEEEEE">
            <SummaryItem
              label="Shop Profit"
              value={isCashAndCancelled ? 0 : order?.baseCurrency_shopEarnings}
              valueSecondary={isCashAndCancelled ? 0 : order?.secondaryCurrency_shopEarnings}
              showIfZero
            />

            <SummaryItem
              label="Shop VAT"
              value={isCashAndCancelled ? 0 : order?.vatAmount?.baseCurrency_vatForShop}
              valueSecondary={isCashAndCancelled ? 0 : order?.vatAmount?.secondaryCurrency_vatForShop}
              showIfZero
            />

            <SummaryItem
              label="Deal compensation amount"
              value={isCashAndCancelled ? 0 : order?.doubleMenuCut?.baseCurrency_doubleMenuAdminCut}
              valueSecondary={isCashAndCancelled ? 0 : order?.doubleMenuCut?.secondaryCurrency_doubleMenuAdminCut}
              tooltip="This amount in already included in shop profit"
              isRejected
            />
          </Box>
        )}

        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <SummaryItem
            label="Rider Profit"
            value={
              order?.shop?.haveOwnDeliveryBoy ? 'Self' : isCashAndCancelled ? 0 : order?.baseCurrency_riderFee || 0
            }
            valueSecondary={
              order?.shop?.haveOwnDeliveryBoy ? 'Self' : isCashAndCancelled ? 0 : order?.secondaryCurrency_riderFee || 0
            }
            showIfZero
          />
        </Box>

        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <SummaryItem
              label="Lyxa Delivery Profit"
              value={isCashAndCancelled ? 0 : order?.adminCharge?.baseCurrency_adminChargeFromDelivery}
              valueSecondary={isCashAndCancelled ? 0 : order?.adminCharge?.secondaryCurrency_adminChargeFromDelivery}
              showIfZero
            />
          )}

          <SummaryItem
            label="Lyxa Order Profit"
            value={isCashAndCancelled ? 0 : order?.adminCharge?.baseCurrency_adminChargeFromOrder}
            valueSecondary={isCashAndCancelled ? 0 : order?.adminCharge?.secondaryCurrency_adminChargeFromOrder}
            showIfZero
          />

          <SummaryItem
            label="Deal compensation amount"
            value={
              isCashAndCancelled
                ? 0
                : order?.doubleMenuCut?.baseCurrency_doubleMenuShopCut + order?.orderDeliveryCharge?.shopCut
            }
            valueSecondary={
              isCashAndCancelled
                ? 0
                : order?.doubleMenuCut?.secondaryCurrency_doubleMenuShopCut +
                  order?.orderDeliveryCharge?.shopCut * adminExchangeRate
            }
            tooltip="This amount already in included lyxa profit"
            isRejected
            hide={isCashAndCancelled}
          />
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <SummaryItem
            label="Total Lyxa Profit"
            isCurrency={false}
            value={isCashAndCancelled ? 0 : order?.adminCharge?.baseCurrency_totalAdminCharge}
            valueSecondary={isCashAndCancelled ? 0 : order?.adminCharge?.secondaryCurrency_totalAdminCharge}
            exchangeRate={adminExchangeRate}
            showIfZero
            isTotal
          />

          <SummaryItem
            label="Lyxa VAT"
            value={isCashAndCancelled ? 0 : order?.vatAmount?.baseCurrency_vatForAdmin}
            valueSecondary={isCashAndCancelled ? 0 : order?.vatAmount?.secondaryCurrency_vatForAdmin}
            pb={isCashAndCancelled ? undefined : 0}
            showIfZero
          />

          <SummaryItem
            label="Total Refunded"
            value={0}
            isTotal
            pb={0}
            hide={!isCashAndCancelled}
            showBaseOnly
            showIfZero
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
