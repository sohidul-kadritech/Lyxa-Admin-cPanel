/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';
import { CustomInfoIcon } from './OrderAmountDetails';

function StyledItem({
  label,
  value,
  total,
  isNegative = false,
  isRejected = false,
  pbsx = 3.5,
  ptxs = 2.5,
  isCurrency = true,
  tooltip,
}) {
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();
  const theme = useTheme();
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

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
        color={!isNegative ? (total ? 'textPrimary' : '#737373') : isRejected ? '#6c757d' : theme.palette.danger.main}
        fontWeight={total ? 700 : undefined}
      >
        {isCurrency ? currency : ''} {value}
      </Typography>
    </Stack>
  );
}

export default function OrderRefundBeforeDelivered({ order = {} }) {
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
            />
            {/* <StyledItem label="Admin VAT Cut" value={} /> */}
            <StyledItem label="Rider Cut" value={order?.userCancelTnx[0]?.deliveryBoyCut} />
            <StyledItem label="Shop Cut" value={order?.userCancelTnx[0]?.shopCut} />
            <StyledItem label="Total Refund" value={order?.userCancelTnx[0]?.amount} total />
          </Box>
        </Box>
      )}
    </StyledOrderDetailBox>
  );
}
