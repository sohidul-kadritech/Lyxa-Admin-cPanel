/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';

function StyledItem({ label, value, total, isNegative, isRejected, pbsx = 3.5, ptxs = 2.5, isCurrency = true }) {
  const theme = useTheme();
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const getAmountColor = (isNegative, total, isRejected) => {
    let color = '#737373';

    if (total) color = 'textPrimary';
    if (isNegative) color = theme.palette.danger.main;
    if (isRejected) color = '#6c757d';

    return color;
  };

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
        color={getAmountColor(isNegative, total, isRejected)}
        fontWeight={total ? 700 : undefined}
        console={console.log(Math.abs(value || 0)?.toFixed(2), value)}
      >
        {isNegative && value !== 0 ? '-' : ''} {isCurrency ? currency : ''}
        {isNegative ? Math.abs(value || 0)?.toFixed(2) : isCurrency ? (value || 0)?.toFixed(2) : value}
      </Typography>
    </Stack>
  );
}

export default function RefundDetails({ order = {} }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;
  const exchangeRate = general?.appSetting?.exchangeRate;

  return (
    <StyledOrderDetailBox title="Refund After Delivered">
      {order?.isRefundedAfterDelivered && order?.userRefundTnx?.length > 0 && (
        <Box pt={2} pb={1}>
          <Box borderBottom="1px solid #EEEEEE">
            <StyledItem
              label="Refund Type"
              isCurrency={false}
              value={order?.userRefundTnx[0]?.isPartialRefund ? 'Partial' : 'Full'}
              pbsx={3.5}
            />
          </Box>
          <Box pt={3.5}>
            <StyledItem label="Admin Cut" value={order?.userRefundTnx[0]?.adminCut} isNegative />
            <StyledItem label="Admin VAT Cut" value={order?.userRefundTnx[0]?.adminVatCut} isNegative />
            <StyledItem label="Rider Cut" value={order?.userRefundTnx[0]?.deliveryBoyCut} isNegative />
            <StyledItem label="Shop Cut" value={order?.userRefundTnx[0]?.shopCut} isNegative />
            <StyledItem
              ptxs={3.5}
              label="Total Refund"
              value={`${secondaryCurrency} ${order?.userRefundTnx[0]?.amount * exchangeRate} ~ ${currency} ${
                order?.userRefundTnx[0]?.amount
              }`}
              total
              isNegative
              isCurrency={false}
            />
          </Box>
        </Box>
      )}
    </StyledOrderDetailBox>
  );
}
