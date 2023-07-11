/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';
import { CustomInfoIcon } from './helpers';

function StyledItem({
  label,
  value,
  total,
  isNegative,
  isRejected,
  pbsx = 3.5,
  ptxs = 2.5,
  isCurrency = true,
  tooltip,
}) {
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

export default function RefundBeforeDelivered({ order = {} }) {
  return (
    <StyledOrderDetailBox title="Refund Before Delivered">
      {order?.userCancelTnx?.length > 0 && (
        <Box pt={2}>
          <Box borderBottom="1px solid #EEEEEE">
            <StyledItem
              label="Refund Type"
              isCurrency={false}
              value={order?.userCancelTnx[0]?.isPartialRefund ? 'Partial' : 'Full'}
            />
          </Box>
          <Box pt={3.5}>
            <StyledItem
              label="Lyxa Cut"
              value={order?.userCancelTnx[0]?.adminCut + order?.userCancelTnx[0]?.adminVatCut}
              tooltip="Lyxa Profit + Lyxa Vat"
              isNegative
            />
            {/* <StyledItem label="Admin VAT Cut" value={} /> */}
            <StyledItem label="Rider Cut" value={order?.userCancelTnx[0]?.deliveryBoyCut} isNegative />
            <StyledItem label="Shop Cut" value={order?.userCancelTnx[0]?.shopCut} isNegative />
            <StyledItem label="Total Refund" value={order?.userCancelTnx[0]?.amount} total isNegative />
          </Box>
        </Box>
      )}
    </StyledOrderDetailBox>
  );
}
