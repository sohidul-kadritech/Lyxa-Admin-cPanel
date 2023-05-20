/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { StyledOrderDetailBox } from './helpers';

function StyledItem({ label, value, total }) {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      pb={total ? 0 : 3.5}
      pt={total ? 2.5 : 0}
      borderTop={total ? '1px solid #EEEEEE' : undefined}
    >
      <Typography variant="body2" color="textPrimary" lineHeight="22px" fontWeight={total ? 700 : undefined}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        lineHeight="22px"
        color={total ? 'textPrimary' : '#737373'}
        fontWeight={total ? 700 : undefined}
      >
        {currency} {value}
      </Typography>
    </Stack>
  );
}

export default function PaymentDetails({ order = {} }) {
  const totalAmount = order?.summary?.productAmount + (order?.orderFor !== 'global' ? order?.summary?.deliveryFee : 0);
  return (
    <StyledOrderDetailBox title="Payment Summary">
      <Box pt={2.5}>
        <StyledItem label="Subtotal" value={totalAmount} />
        <StyledItem label="Lyxa fee" value={order?.dropCharge?.dropChargeFromOrder} />
        <StyledItem label="Profit" value={totalAmount - order?.dropCharge?.dropChargeFromOrder} total />
      </Box>
    </StyledOrderDetailBox>
  );
}
