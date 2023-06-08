/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../../context';
import { StyledOrderDetailBox } from './helpers';

function StyledItem({
  label,
  value,
  total,
  isNegative = false,
  isRejected = false,
  pbsx = 3.5,
  ptxs = 2.5,
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
        {isCurrency ? currency : ''} {value}
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
          <StyledItem pbsx={2.5} label="Shop Profit" value={totalAmount - order?.dropCharge?.dropChargeFromOrder} />
          <StyledItem pbsx={2.5} label="Shop VAT" value={order?.vatAmount?.vatForShop} />
        </Box>

        <Box pt={2.5} borderTop="1px solid #EEEEEE">
          <StyledItem pbsx={2.5} label="Rider Profit" value={order?.deliveryBoyFee} />
        </Box>
        <Box pt={2.5} borderTop="1px solid #EEEEEE">
          <StyledItem
            pbsx={2.5}
            label="Lyxa Delivery Profit"
            isNegative
            isRejected
            value={order?.dropCharge?.dropChargeFromDelivery}
          />

          <StyledItem pbsx={2.5} label="Lyxa Order Profit" value={order?.dropCharge?.dropChargeFromOrder} />
        </Box>

        <StyledItem pbsx={2.5} label="Total Lyxa Profit" value={totalLyxaProfit} total />

        <Box pbsx={2.5} pt={2.5} borderBottom="1px solid #EEEEEE">
          <StyledItem pbsx={2.5} label="Lyxa VAT" value={order?.vatAmount?.vatForAdmin} />
        </Box>
        {order?.isRefundedAfterDelivered && (
          <>
            <Box pbsx={2.5} pt={2.5} borderBottom="1px solid #EEEEEE">
              <StyledItem
                pt={2.5}
                pbsx={2.5}
                label="Refund Type"
                isCurrency={false}
                value={order?.userRefundTnx[0]?.isPartialRefund ? 'Partial' : 'full'}
              />
            </Box>
            <StyledItem pbsx={2.5} label="Admin Cut" value={order?.userRefundTnx[0]?.adminCut} />
            <StyledItem pbsx={2.5} label="Admin VAT Cut" value={order?.userRefundTnx[0]?.adminVatCut} />
            <StyledItem pbsx={2.5} label="Rider Cut" value={order?.userRefundTnx[0]?.deliveryBoyCut} />
            <StyledItem pbsx={2.5} label="Shop Cut" value={order?.userRefundTnx[0]?.shopCut} />
            <StyledItem pbsx={2.5} label="Total Refund" value={order?.userRefundTnx[0]?.amount} total />
          </>
        )}
      </Box>
    </StyledOrderDetailBox>
  );
}
