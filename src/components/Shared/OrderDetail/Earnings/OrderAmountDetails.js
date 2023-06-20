/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';

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
}) {
  const theme = useTheme();
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  // eslint-disable-next-line prettier/prettier, react/jsx-no-useless-fragment
  if (hideZero && Math.abs(value) === 0) return <></>;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" pb={total ? 0 : pbsx} pt={ptxs}>
      <Typography variant="body2" color="textPrimary" lineHeight="22px" fontWeight={total ? 700 : undefined}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        lineHeight="22px"
        color={!isNegative ? (total ? 'textPrimary' : '#737373') : isRejected ? '#6c757d' : theme.palette.danger.main}
        fontWeight={total ? 700 : undefined}
      >
        {isCurrency ? currency : ''} {value}
      </Typography>
    </Stack>
  );
}

export default function OrderAmountDetails({ order = {} }) {
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;

  console.log({ order });

  return (
    <StyledOrderDetailBox title="Order Profit Details">
      <Box pt={2}>
        <StyledItem label="Total Order Amount" value={(totalPayment || 0).toFixed(2)} />
        <StyledItem label="Rewards (admin)" value={order?.rewardRedeemCut?.rewardAdminCut} hideZero />
        <StyledItem label="Rewards (shop)" value={order?.rewardRedeemCut?.rewardShopCut} hideZero />
        <StyledItem
          label="Buy 1 Get 1 (admin) "
          value={order?.doubleMenuItemPrice?.doubleMenuItemPriceAdmin}
          hideZero
        />
        <StyledItem label="Buy 1 Get 1  (shop)" value={order?.doubleMenuItemPrice?.doubleMenuItemPriceShop} hideZero />
        <StyledItem label="Discount (admin)" value={order?.discountCut?.discountAdminCut} hideZero />
        <StyledItem label="Discount (shop)" value={order?.discountCut?.discountShopCut} hideZero />

        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <StyledItem label="Shop Profit" value={(order?.sellerEarnings || 0).toFixed(2)} />
          <StyledItem label="Shop VAT" value={(order?.vatAmount?.vatForShop || 0).toFixed(2)} />
          <StyledItem label="Deal compensation amount" value={order?.doubleMenuCut?.doubleMenuAdminCut} hideZero />
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <StyledItem
            label="Rider Profit"
            isCurrency={!order?.shop?.haveOwnDeliveryBoy}
            value={order?.shop?.haveOwnDeliveryBoy ? 'Self' : (order?.deliveryBoyFee || 0).toFixed(2)}
          />
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          {!order?.shop?.haveOwnDeliveryBoy && (
            <StyledItem
              label="Lyxa Delivery Profit"
              value={(order?.dropCharge?.dropChargeFromDelivery || 0).toFixed(2)}
            />
          )}
          <StyledItem label="Lyxa Order Profit" value={(order?.dropCharge?.dropChargeFromOrder || 0).toFixed(2)} />
          <StyledItem label="Deal compensation amount" value={order?.doubleMenuCut?.doubleMenuShopCut} hideZero />
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <StyledItem label="Total Lyxa Profit" value={(order?.dropCharge?.totalDropAmount || 0).toFixed(2)} />
          <StyledItem label="Lyxa VAT" value={(order?.vatAmount?.vatForAdmin || 0).toFixed(2)} />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
