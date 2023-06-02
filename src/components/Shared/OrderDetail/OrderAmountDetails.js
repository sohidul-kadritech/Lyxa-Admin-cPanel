/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../../context';
import { StyledOrderDetailBox } from './helpers';

function StyledItem({ label, value, total, isNegative = false, isRejected = false, pbsx = 3.5, ptxs = 2.5 }) {
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();
  const theme = useTheme();
  const { general } = useGlobalContext();
  const currency = general?.currency?.code?.toUpperCase();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      pb={total ? 0 : pbsx}
      pt={total ? ptxs : 0}
      borderTop={total ? '1px solid #EEEEEE' : undefined}
    >
      <Typography variant="body2" color="textPrimary" lineHeight="22px" fontWeight={total ? 700 : undefined}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        lineHeight="22px"
        color={!isNegative ? (total ? 'textPrimary' : '#737373') : isRejected ? '#6c757d' : theme.palette.danger.main}
        fontWeight={total ? 700 : undefined}
      >
        {currency} {value}
      </Typography>
    </Stack>
  );
}

export default function OrderAmountDetails({ order = {} }) {
  console.log('Order details: ', order);
  const totalAmount = order?.summary?.productAmount + (order?.orderFor !== 'global' ? order?.summary?.deliveryFee : 0);
  const totalLyxaProfit =
    order?.summary?.deliveryFee -
      order?.deliveryBoyFee +
      (order?.dropCharge?.totalDropAmount - order?.deliveryBoyFee) || 0;
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;
  return (
    <StyledOrderDetailBox title="Order Amount Details">
      <Box>
        <StyledItem pbsx={2.5} label="Total Order Amount" value={totalPayment} />

        <Box pt={2.5} borderTop="1px solid #EEEEEE">
          <StyledItem label="Shop Profit" value={totalAmount - order?.dropCharge?.dropChargeFromOrder} />
          <StyledItem label="Shop VAT" value={order?.vatAmount?.vatForShop} />
        </Box>

        <Box pt={2.5} borderTop="1px solid #EEEEEE">
          <StyledItem label="Rider Profit" value={order?.deliveryBoyFee} />
        </Box>
        <Box pt={2.5} borderTop="1px solid #EEEEEE">
          <StyledItem
            label="Lyxa Delivery Profit"
            isNegative
            isRejected
            value={order?.summary?.deliveryFee - order?.deliveryBoyFee}
          />

          <StyledItem label="Lyxa Order Profit" value={order?.dropCharge?.totalDropAmount - order?.deliveryBoyFee} />
        </Box>

        <StyledItem label="Total Lyxa Profit" value={totalLyxaProfit} total />

        <Box pt={2.5}>
          <StyledItem label="Lyxa VAT" value={order?.vatAmount?.vatForAdmin} />
        </Box>
        {order?.isRefundedAfterDelivered && (
          <>
            <StyledItem label="Refund Type" value={totalAmount - order?.dropCharge?.dropChargeFromOrder} />
            <StyledItem label="Admin Cut" value={totalAmount - order?.dropCharge?.dropChargeFromOrder} />
            <StyledItem label="Rider Cut" value={totalAmount - order?.dropCharge?.dropChargeFromOrder} />
            <StyledItem label="Shop Cut" value={totalAmount - order?.dropCharge?.dropChargeFromOrder} />
            <StyledItem label="Total Refund" value={totalAmount - order?.dropCharge?.dropChargeFromOrder} total />
          </>
        )}
      </Box>
    </StyledOrderDetailBox>
  );
}
