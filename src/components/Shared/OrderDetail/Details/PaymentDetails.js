/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';

function StyledItem({ label, value, total, isNegative = false, isRejected = false }) {
  const theme = useTheme();
  const { general } = useGlobalContext();
  const currency = general?.currency?.code?.toUpperCase();

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
        color={!isNegative ? (total ? 'textPrimary' : '#737373') : isRejected ? '#6c757d' : theme.palette.danger.main}
        fontWeight={total ? 700 : undefined}
      >
        {currency} {value}
      </Typography>
    </Stack>
  );
}

export default function PaymentDetails({ order = {} }) {
  console.log('Order details: ', order);

  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;

  return (
    <StyledOrderDetailBox title="Payment Summary">
      <Box pt={2.5}>
        <StyledItem label="Subtotal" value={(order?.summary?.productAmount || 0).toFixed(2)} />
        <StyledItem label="Delivery fee" value={(order?.summary?.deliveryFee || 0).toFixed(2)} />
        {order?.summary?.riderTip > 0 && (
          <StyledItem label="Rider Tips" value={(order?.summary?.riderTip || 0).toFixed(2)} />
        )}
        {order?.summary?.discount > 0 && (
          <StyledItem
            label="Discount"
            isNegative
            isRejected={false}
            value={(order?.summary?.discount || 0).toFixed(2)}
          />
        )}
        {/* {order?.summary?.doubleMenuItemPrice > 0 && (
          <StyledItem
            label="Double Deals"
            isNegative
            isRejected={false}
            value={(order?.summary?.doubleMenuItemPrice || 0).toFixed(2)}
          />
        )} */}
        {order?.summary?.reward?.amount > 0 && (
          <StyledItem
            label="Rewards"
            isNegative
            isRejected={false}
            value={`${(order?.summary?.reward?.amount || 0).toFixed(2)} = ${order?.summary?.reward?.points} Pts`}
          />
        )}
        {order?.summary?.vat > 0 && <StyledItem label="VAT" value={(order?.summary?.vat || 0).toFixed(2)} />}
        <StyledItem label="Total" value={(totalPayment || 0).toFixed(2)} total />
      </Box>
    </StyledOrderDetailBox>
  );
}
