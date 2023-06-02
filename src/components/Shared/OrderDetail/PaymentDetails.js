/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../../context';
import { StyledOrderDetailBox } from './helpers';

function StyledItem({ label, value, total, isNegative = false, isRejected = false }) {
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();
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

  // eslint-disable-next-line no-unused-vars
  const totalPayment = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card || 0;
  return (
    <StyledOrderDetailBox title="Payment Summary">
      <Box pt={2.5}>
        <StyledItem label="Subtotal" value={order?.summary?.productAmount} />
        <StyledItem label="Delivery fee" value={order?.summary?.deliveryFee} />
        {order?.summary?.riderTip > 0 && <StyledItem label="Rider Tips" value={order?.summary?.riderTip} />}

        {order?.summary?.discount > 0 && (
          <StyledItem label="Discount" isNegative isRejected={false} value={order?.summary?.discount} />
        )}

        {order?.summary?.doubleMenuItemPrice > 0 && (
          <StyledItem label="Duble Deals" isNegative isRejected value={order?.summary?.doubleMenuItemPrice} />
        )}

        {order?.summary?.reward?.amount > 0 && (
          <StyledItem
            label="Rewards"
            isNegative
            isRejected={false}
            value={`${order?.summary?.reward?.amount} = ${order?.summary?.reward?.points} Pts`}
          />
        )}

        {order?.summary?.vat > 0 && <StyledItem label="VAT" value={order?.summary?.vat} />}

        <StyledItem label="Total" value={totalPayment} total />
      </Box>
    </StyledOrderDetailBox>
  );
}
