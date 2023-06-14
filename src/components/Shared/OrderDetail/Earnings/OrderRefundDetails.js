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

export default function OrderRefundDetails({ order = {} }) {
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
            <StyledItem label="Admin Cut" value={(order?.userRefundTnx[0]?.adminCut || 0).toFixed(2)} />
            <StyledItem label="Admin VAT Cut" value={(order?.userRefundTnx[0]?.adminVatCut || 0).toFixed(2)} />
            <StyledItem label="Rider Cut" value={(order?.userRefundTnx[0]?.deliveryBoyCut || 0).toFixed(2)} />
            <StyledItem label="Shop Cut" value={(order?.userRefundTnx[0]?.shopCut || 0).toFixed(2)} />
            <StyledItem
              ptxs={3.5}
              label="Total Refund"
              value={(order?.userRefundTnx[0]?.amount || 0).toFixed(2)}
              total
            />
          </Box>
        </Box>
      )}
    </StyledOrderDetailBox>
  );
}
