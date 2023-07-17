/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';
import { StyledItem } from './helpers';

export default function AmountDetails({ order = {} }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;
  const isCashAndCancelled =
    order?.orderStatus === 'cancelled' && !order?.userCancelTnx?.length && !order?.isRefundedAfterDelivered;

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <StyledItem label="Total Order Amount" value={(totalPayment || 0).toFixed(2)} />
        {/* discount / marketing */}
        <StyledItem
          label="Loyalty Points"
          value={
            isCashAndCancelled ? 0 : order?.rewardRedeemCut?.rewardAdminCut + order?.rewardRedeemCut?.rewardShopCut
          }
          hideZero
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
                  Applied by lyxa {currency} {order?.rewardRedeemCut?.rewardAdminCut || 0}
                </li>
                <li>
                  Applied by shop {currency} {order?.rewardRedeemCut?.rewardShopCut || 0}
                </li>
              </ul>
            </Box>
          }
        />
        <StyledItem
          label="Buy 1 Get 1 (admin) "
          value={isCashAndCancelled ? 0 : order?.doubleMenuItemPrice?.doubleMenuItemPriceAdmin}
          tooltip="Buy 1 Get 1 deal added by admin"
          hideZero
        />
        <StyledItem
          label="Buy 1 Get 1  (shop)"
          value={isCashAndCancelled ? 0 : order?.doubleMenuItemPrice?.doubleMenuItemPriceShop}
          hideZero
          tooltip="Buy 1 Get 1 deal added by shop"
        />
        <StyledItem
          label="Discount (admin)"
          value={isCashAndCancelled ? 0 : order?.discountCut?.discountAdminCut}
          hideZero
          tooltip="Discount deal added by admin"
        />
        <StyledItem
          label="Discount (shop)"
          value={isCashAndCancelled ? 0 : order?.discountCut?.discountShopCut}
          hideZero
          tooltip="Discount deal added by shop"
        />
        <StyledItem
          label="Free Delivery (admin)"
          value={isCashAndCancelled ? 0 : order?.orderDeliveryCharge?.dropCut}
          hideZero
          tooltip="Free Delivery added by admin"
        />
        <StyledItem
          label="Free Delivery (shop)"
          value={isCashAndCancelled ? 0 : order?.orderDeliveryCharge?.shopCut}
          hideZero
          tooltip="Free Delivery added by shop"
        />
        <StyledItem
          label="Coupon Discount "
          value={isCashAndCancelled ? 0 : order?.summary?.couponDiscountAmount || 0}
          tooltip="Discount coupon created by admin"
          hideZero
        />
        {/* not needed for butler order */}
        {!order?.isButler && (
          <Box pt={3.5} borderTop="1px solid #EEEEEE">
            <StyledItem label="Shop Profit" value={(isCashAndCancelled ? 0 : order?.sellerEarnings || 0).toFixed(2)} />
            <StyledItem
              label="Shop VAT"
              value={(isCashAndCancelled ? 0 : order?.vatAmount?.vatForShop || 0).toFixed(2)}
            />
            <StyledItem
              label="Deal compensation amount"
              value={isCashAndCancelled ? 0 : order?.doubleMenuCut?.doubleMenuAdminCut}
              tooltip="This amount in already included in shop profit"
              hideZero
              isRejected
            />
          </Box>
        )}
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <StyledItem
            label="Rider Profit"
            isCurrency={!order?.shop?.haveOwnDeliveryBoy}
            value={
              order?.shop?.haveOwnDeliveryBoy
                ? 'Self'
                : (isCashAndCancelled ? 0 : order?.deliveryBoyFee || 0).toFixed(2)
            }
          />
          {/* order?.summary?.deliveryFee */}
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <StyledItem
              label="Lyxa Delivery Profit"
              value={(isCashAndCancelled ? 0 : order?.dropCharge?.dropChargeFromDelivery || 0).toFixed(2)}
            />
          )}
          <StyledItem
            label="Lyxa Order Profit"
            value={(isCashAndCancelled ? 0 : order?.dropCharge?.dropChargeFromOrder || 0).toFixed(2)}
          />
          <StyledItem
            label="Deal compensation amount"
            value={
              isCashAndCancelled ? 0 : order?.doubleMenuCut?.doubleMenuShopCut + order?.orderDeliveryCharge?.shopCut
            }
            tooltip="This amount already in included lyxa profit"
            hideZero
            isRejected
          />
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <StyledItem
            label="Total Lyxa Profit"
            value={(isCashAndCancelled ? 0 : order?.dropCharge?.totalDropAmount || 0).toFixed(2)}
          />
          <StyledItem
            label="Lyxa VAT"
            value={(order?.vatAmount?.vatForAdmin || 0).toFixed(2)}
            pbsx={!isCashAndCancelled ? 0 : undefined}
          />
          {isCashAndCancelled && <StyledItem label="Total Refunded" value={(0).toFixed(2)} total noBorder />}
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
