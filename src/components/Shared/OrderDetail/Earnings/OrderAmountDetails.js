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
}) {
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
      pt={ptxs}
      // borderTop={total ? '1px solid #EEEEEE' : undefined}
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
        {isCurrency ? currency : ''} {value}
      </Typography>
    </Stack>
  );
}

export default function OrderAmountDetails({ order = {} }) {
  const totalAmount = order?.summary?.productAmount + (order?.orderFor !== 'global' ? order?.summary?.deliveryFee : 0);
  const totalLyxaProfit =
    order?.summary?.deliveryFee -
      order?.deliveryBoyFee +
      (order?.dropCharge?.totalDropAmount - order?.deliveryBoyFee) || 0;
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;
  return (
    <StyledOrderDetailBox title="Order Amount Details">
      <Box pt={2}>
        <StyledItem label="Total Order Amount" value={(totalPayment || 0).toFixed(2)} />
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <StyledItem
            label="Shop Profit"
            value={(totalAmount - order?.dropCharge?.dropChargeFromOrder || 0).toFixed(2)}
          />
          <StyledItem label="Shop VAT" value={(order?.vatAmount?.vatForShop || 0).toFixed(2)} />
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <StyledItem label="Rider Profit" value={(order?.deliveryBoyFee || 0).toFixed(2)} />
        </Box>
        <Box pt={3.5} borderTop="1px solid #EEEEEE">
          <StyledItem
            label="Lyxa Delivery Profit"
            isNegative
            isRejected
            value={(order?.dropCharge?.dropChargeFromDelivery || 0).toFixed(2)}
          />
          <StyledItem label="Lyxa Order Profit" value={(order?.dropCharge?.dropChargeFromOrder || 0).toFixed(2)} />
        </Box>
        <Box borderTop="1px solid #EEEEEE" pt={3.5}>
          <StyledItem label="Total Lyxa Profit" value={(totalLyxaProfit || 0).toFixed(2)} total />
          <StyledItem label="Lyxa VAT" value={(order?.vatAmount?.vatForAdmin || 0).toFixed(2)} ptxs={3.5} pbsx={1} />
        </Box>
      </Box>
    </StyledOrderDetailBox>
  );
}
