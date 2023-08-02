/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import React from 'react';
import { StyledOrderDetailBox, SummaryItem, getTotalOrderInSecondary } from '../helpers';

export default function ProfitDetails({ order = {} }) {
  const currency = order?.baseCurrency?.symbol;
  const secondaryCurrency = order?.secondaryCurrency?.code;
  const adminExchangeRate = order?.adminExchangeRate;
  const shopExchangeRate = order?.shopExchangeRate;

  console.log('order', order);

  const total =
    order?.summary?.baseCurrency_cash + order?.summary?.baseCurrency_wallet + order?.summary?.baseCurrency_card || 0;
  const isCashAndCancelled =
    order?.orderStatus === 'cancelled' && !order?.userCancelTnx?.length && !order?.isRefundedAfterDelivered;

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <SummaryItem
          label="Total Order Amount"
          skipExchangeRate
          value={
            shopExchangeRate > 1
              ? `${secondaryCurrency} ${getTotalOrderInSecondary(order)} ~ ${currency} ${total}`
              : total
          }
          showIfZero
        />
        <SummaryItem
          label="Loyalty Points"
          value={
            order?.rewardRedeemCut?.baseCurrency_rewardAdminCut + order?.rewardRedeemCut?.baseCurrency_rewardShopCut
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
          useAdminRate
        />
        <SummaryItem
          label="Buy 1 Get 1 (admin)"
          value={order?.doubleMenuItemPrice?.baseCurrency_doubleMenuItemPriceAdmin}
          tooltip="Buy 1 Get 1 deal added by admin"
          hide={isCashAndCancelled}
          useAdminRate
        />
        <SummaryItem
          label="Buy 1 Get 1 (shop)"
          value={order?.doubleMenuItemPrice?.baseCurrency_doubleMenuItemPriceShop}
          tooltip="Buy 1 Get 1 deal added by shop"
          hide={isCashAndCancelled}
          useAdminRate
        />
        <SummaryItem
          label="Discount (admin)"
          value={order?.discountCut?.baseCurrency_discountAdminCut}
          tooltip="Discount deal added by admin"
          hide={isCashAndCancelled}
          useAdminRate
        />
        <SummaryItem
          label="Discount (shop)"
          value={order?.discountCut?.baseCurrency_discountShopCut}
          tooltip="Discount deal added by shop"
          hide={isCashAndCancelled}
          useAdminRate
        />
        <SummaryItem
          label="Free Delivery (admin)"
          value={order?.orderDeliveryCharge?.dropCut}
          tooltip="Free Delivery added by admin"
          hide={isCashAndCancelled}
          useAdminRate
        />
        <SummaryItem
          label="Free Delivery (shop)"
          value={order?.orderDeliveryCharge?.shopCut}
          tooltip="Free Delivery added by shop"
          hide={isCashAndCancelled}
          useAdminRate
        />
        <SummaryItem
          label="Coupon Discount "
          value={order?.summary?.baseCurrency_couponDiscountAmount}
          tooltip="Discount coupon created by admin"
          hide={isCashAndCancelled}
          useAdminRate
        />
        {/* not needed for butler order */}
        {!order?.isButler && (
          <Box pt={3.5} borderTop="1px solid #EEEEEE">
            <SummaryItem
              label="Shop Profit"
              value={isCashAndCancelled ? 0 : order?.baseCurrency_shopEarnings}
              showIfZero
            />
            <SummaryItem
              label="Shop VAT"
              value={isCashAndCancelled ? 0 : order?.vatAmount?.baseCurrency_vatForShop}
              showIfZero
            />
            <SummaryItem
              label="Deal compensation amount"
              value={isCashAndCancelled ? 0 : order?.doubleMenuCut?.baseCurrency_doubleMenuAdminCut}
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
            showIfZero
            exchangeRate={adminExchangeRate}
            useAdminRate
          />
          {/* <SummaryItem
            label="Rider Tip"
            value={order?.summary?.baseCurrency_riderTip}
            exchangeRate={adminExchangeRate}
            useAdminRate
          /> */}
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <SummaryItem
              label="Lyxa Delivery Profit"
              value={isCashAndCancelled ? 0 : order?.adminCharge?.baseCurrency_adminChargeFromDelivery}
              useAdminRate
              showIfZero
            />
          )}
          <SummaryItem
            label="Lyxa Order Profit"
            value={isCashAndCancelled ? 0 : order?.adminCharge?.baseCurrency_adminChargeFromOrder}
            useAdminRate
            showIfZero
          />
          <SummaryItem
            label="Deal compensation amount"
            value={
              isCashAndCancelled
                ? 0
                : order?.doubleMenuCut?.baseCurrency_doubleMenuShopCut + order?.orderDeliveryCharge?.shopCut
            }
            tooltip="This amount already in included lyxa profit"
            isRejected
            hide={isCashAndCancelled}
            useAdminRate
          />
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <SummaryItem
            label="Total Lyxa Profit"
            isCurrency={false}
            value={isCashAndCancelled ? 0 : order?.adminCharge?.baseCurrency_totalAdminCharge}
            exchangeRate={adminExchangeRate}
            useAdminRate
            showIfZero
            isTotal
          />
          <SummaryItem
            label="Lyxa VAT"
            value={isCashAndCancelled ? 0 : order?.vatAmount?.baseCurrency_vatForAdmin}
            useAdminRate
            pb={isCashAndCancelled ? undefined : 0}
            showIfZero
          />
          <SummaryItem
            label="Total Refunded"
            value={0}
            isTotal
            pb={0}
            hide={!isCashAndCancelled}
            useAdminRate
            showIfZero
          />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
