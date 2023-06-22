/* eslint-disable no-unsafe-optional-chaining */
import { Box } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';
import { StyledItem } from './helpers';

export default function OrderAmountDetails({ order = {} }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <StyledItem label="Total Order Amount" value={(totalPayment || 0).toFixed(2)} />
        <StyledItem
          label="Loyalty Points"
          value={order?.rewardRedeemCut?.rewardAdminCut + order?.rewardRedeemCut?.rewardShopCut}
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
          label="Rewards (shop)"
          // value={}
          hideZero
          tooltip="Reward point cut that shop pays"
        />
        <StyledItem
          label="Buy 1 Get 1 (admin) "
          value={order?.doubleMenuItemPrice?.doubleMenuItemPriceAdmin}
          tooltip="Buy 1 Get 1 deal added by admin"
          hideZero
        />
        <StyledItem
          label="Buy 1 Get 1  (shop)"
          value={order?.doubleMenuItemPrice?.doubleMenuItemPriceShop}
          hideZero
          tooltip="Buy 1 Get 1 deal added by shop"
        />
        <StyledItem
          label="Discount (admin)"
          value={order?.discountCut?.discountAdminCut}
          hideZero
          tooltip="Discount deal added by admin"
        />
        <StyledItem
          label="Discount (shop)"
          value={order?.discountCut?.discountShopCut}
          hideZero
          tooltip="Discount deal added by shop"
        />
        <StyledItem
          label="Free Delivery (admin)"
          value={order?.orderDeliveryCharge?.dropCut}
          hideZero
          tooltip="Free Delivery added by admin"
        />
        <StyledItem
          label="Free Delivery (shop)"
          value={order?.orderDeliveryCharge?.shopCut}
          hideZero
          tooltip="Free Delivery added by shop"
        />
        {/* not needed for butler order */}
        {!order?.isButler && (
          <Box pt={3.5} borderTop="1px solid #EEEEEE">
            <StyledItem label="Shop Profit" value={(order?.sellerEarnings || 0).toFixed(2)} />
            <StyledItem label="Shop VAT" value={(order?.vatAmount?.vatForShop || 0).toFixed(2)} />
            <StyledItem
              label="Deal compensation amount"
              value={order?.doubleMenuCut?.doubleMenuAdminCut}
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
            value={order?.shop?.haveOwnDeliveryBoy ? 'Self' : (order?.deliveryBoyFee || 0).toFixed(2)}
          />
          {/* order?.summary?.deliveryFee */}
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <StyledItem
              label="Lyxa Delivery Profit"
              value={(order?.dropCharge?.dropChargeFromDelivery || 0).toFixed(2)}
            />
          )}
          <StyledItem label="Lyxa Order Profit" value={(order?.dropCharge?.dropChargeFromOrder || 0).toFixed(2)} />
          <StyledItem
            label="Deal compensation amount"
            value={order?.doubleMenuCut?.doubleMenuShopCut + order?.orderDeliveryCharge?.shopCut}
            tooltip="This amount already in included lyxa profit"
            hideZero
            isRejected
          />
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <StyledItem label="Total Lyxa Profit" value={(order?.dropCharge?.totalDropAmount || 0).toFixed(2)} />
          <StyledItem label="Lyxa VAT" value={(order?.vatAmount?.vatForAdmin || 0).toFixed(2)} pbsx={0} />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
