/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import React from 'react';
import { StyledOrderDetailBox, SummaryItem } from '../helpers';

export default function ProfitDetails({ order = {} }) {
  const currency = order?.baseCurrency?.symbol;
  const secondaryCurrency = order?.secondaryCurrency?.code;
  const shopExchangeRate = order?.shopExchangeRate;

  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;
  const isCashAndCancelled =
    order?.orderStatus === 'cancelled' && !order?.userCancelTnx?.length && !order?.isRefundedAfterDelivered;

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <SummaryItem label="Total Order Amount" value={totalPayment} showIfZero />
        <SummaryItem
          label="Loyalty Points"
          value={order?.rewardRedeemCut?.rewardAdminCut + order?.rewardRedeemCut?.rewardShopCut}
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
                  Applied by lyxa {currency} {order?.rewardRedeemCut?.rewardAdminCut / shopExchangeRate || 0}
                </li>
                <li>
                  Applied by shop {currency} {order?.rewardRedeemCut?.rewardShopCut / shopExchangeRate || 0}
                </li>
              </ul>
            </Box>
          }
          hide={isCashAndCancelled}
        />
        <SummaryItem
          label="Buy 1 Get 1 (admin)"
          value={order?.doubleMenuItemPrice?.doubleMenuItemPriceAdmin}
          tooltip="Buy 1 Get 1 deal added by admin"
          hide={isCashAndCancelled}
        />
        <SummaryItem
          label="Buy 1 Get 1 (shop)"
          value={order?.doubleMenuItemPrice?.doubleMenuItemPriceShop}
          tooltip="Buy 1 Get 1 deal added by shop"
          hide={isCashAndCancelled}
        />
        <SummaryItem
          label="Discount (admin)"
          value={order?.discountCut?.discountAdminCut}
          tooltip="Discount deal added by admin"
          hide={isCashAndCancelled}
        />
        <SummaryItem
          label="Discount (shop)"
          value={order?.discountCut?.discountShopCut}
          tooltip="Discount deal added by shop"
          hide={isCashAndCancelled}
        />
        <SummaryItem
          label="Free Delivery (admin)"
          value={order?.orderDeliveryCharge?.dropCut}
          tooltip="Free Delivery added by admin"
          hide={isCashAndCancelled}
        />
        <SummaryItem
          label="Free Delivery (shop)"
          value={order?.orderDeliveryCharge?.shopCut}
          tooltip="Free Delivery added by shop"
          hide={isCashAndCancelled}
        />
        <SummaryItem
          label="Coupon Discount "
          value={order?.summary?.couponDiscountAmount}
          tooltip="Discount coupon created by admin"
          hide={isCashAndCancelled}
        />
        {/* not needed for butler order */}
        {!order?.isButler && (
          <Box pt={3.5} borderTop="1px solid #EEEEEE">
            <SummaryItem label="Shop Profit" value={isCashAndCancelled ? 0 : order?.sellerEarnings} showIfZero />
            <SummaryItem label="Shop VAT" value={isCashAndCancelled ? 0 : order?.vatAmount?.vatForShop} showIfZero />
            <SummaryItem
              label="Deal compensation amount"
              value={isCashAndCancelled ? 0 : order?.doubleMenuCut?.doubleMenuAdminCut}
              tooltip="This amount in already included in shop profit"
              isRejected
            />
          </Box>
        )}
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <SummaryItem
            label="Rider Profit"
            value={
              order?.shop?.haveOwnDeliveryBoy
                ? 'Self'
                : isCashAndCancelled
                ? 0
                : order?.deliveryBoyFee / shopExchangeRate || 0
            }
            showIfZero
          />
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <SummaryItem
              label="Lyxa Delivery Profit"
              value={isCashAndCancelled ? 0 : order?.dropCharge?.dropChargeFromDelivery}
              showIfZero
            />
          )}
          <SummaryItem
            label="Lyxa Order Profit"
            value={isCashAndCancelled ? 0 : order?.dropCharge?.dropChargeFromOrder}
            showIfZero
          />
          <SummaryItem
            label="Deal compensation amount"
            value={
              isCashAndCancelled ? 0 : order?.doubleMenuCut?.doubleMenuShopCut + order?.orderDeliveryCharge?.shopCut
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
            value={`${secondaryCurrency} ${
              isCashAndCancelled ? 0 : order?.dropCharge?.totalDropAmount || 0
            } ~ ${currency} ${(isCashAndCancelled
              ? 0
              : order?.dropCharge?.totalDropAmount / shopExchangeRate || 0
            ).toFixed(2)}`}
          />
          <SummaryItem
            label="Lyxa VAT"
            value={order?.vatAmount?.vatForAdmin}
            pb={isCashAndCancelled ? undefined : 0}
            showIfZero
          />
          <SummaryItem
            label="Total Refunded"
            value={`${secondaryCurrency} ${0} ~ ${currency} ${(0).toFixed(2)}`}
            isTotal
            pb={0}
            hide={!isCashAndCancelled}
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
