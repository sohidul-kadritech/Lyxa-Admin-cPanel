/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';

export const CustomInfoIcon = React.forwardRef(({ ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    style={{
      border: '1px solid',
      borderRadius: '50%',
      width: '16px',
      height: '16px',
      display: 'inline-flex',
      textAlign: 'center',
      fontSize: '11px',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    i
  </span>
));

function StyledItem({
  label,
  value,
  total,
  isNegative = false,
  isRejected = false,
  pbsx = 3.5,
  ptxs,
  isCurrency = true,
  hideZero,
  tooltip,
}) {
  const theme = useTheme();
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  // eslint-disable-next-line prettier/prettier, react/jsx-no-useless-fragment
  if (hideZero && Math.abs(value) === 0) return <></>;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" pb={total ? 0 : pbsx} pt={ptxs}>
      <Typography
        variant="body2"
        lineHeight="22px"
        className={`${isRejected ? 'rejected' : ''} ${total ? 'total' : ''}`}
        sx={{
          color: '#363636',

          '&.rejected': {
            color: '#b9b9b9',
          },

          '&.total': {
            fontWeight: '700',
          },
        }}
      >
        {label}{' '}
        {tooltip && (
          <Tooltip title={tooltip}>
            <CustomInfoIcon />
          </Tooltip>
        )}
      </Typography>
      <Typography
        variant="body2"
        lineHeight="22px"
        className={`${isNegative ? 'negative' : ''} ${isRejected ? 'rejected' : ''} ${total ? 'total' : ''}`}
        sx={{
          color: '#737373',

          '&.negative': {
            color: theme.palette.danger.main,
          },

          '&.rejected': {
            color: '#b9b9b9',
          },

          '&.total': {
            color: '#363636',
            fontWeight: '700',
          },
        }}
      >
        {isCurrency ? currency : ''} {value}
      </Typography>
    </Stack>
  );
}

export default function OrderAmountDetails({ order = {} }) {
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <StyledItem label="Total Order Amount" value={(totalPayment || 0).toFixed(2)} />
        <StyledItem
          label="Rewards (admin)"
          value={order?.rewardRedeemCut?.rewardAdminCut}
          hideZero
          tooltip="Reward point cut that lyxa pays"
        />
        <StyledItem
          label="Rewards (shop)"
          value={order?.rewardRedeemCut?.rewardShopCut}
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
