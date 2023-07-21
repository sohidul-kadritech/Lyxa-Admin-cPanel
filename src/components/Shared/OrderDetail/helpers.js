/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { OrderContext } from './OrderContext';

// Order Details Handling
export function StyledOrderDetailBox({ title, children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      {title && (
        <Typography variant="body4" display="block" pb={2} fontWeight={600}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

export const CustomInfoIcon = React.forwardRef(({ ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    style={{
      border: '1px solid',
      borderRadius: '50%',
      width: '16px',
      height: '16px',
      display: 'inline-flex',
      textAlign: 'center',
      fontSize: '11px',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'default',
    }}
  >
    i
  </span>
));

export function SummaryItem({
  pt,
  pb,
  hide,
  tooltip,
  label,
  value,
  isTotal,
  isRejected,
  isNegative,
  showIfZero,
  hideCurrency,
  exchangeRate,
  skipExchangeRate,
  useAdminRate,
  decimalPrecision = 2,
  showBaseOnly,
}) {
  const theme = useTheme();
  const context = useContext(OrderContext);
  const { baseCurrency, secondaryCurrency, shopExchangeRate, adminExchangeRate } = context || {};
  let excRate = shopExchangeRate;

  console.log('context', context);

  if (hide) return null;
  if (!showIfZero && !value) return null;

  if (useAdminRate) excRate = adminExchangeRate;
  if (exchangeRate) excRate = exchangeRate;
  if (skipExchangeRate) excRate = 1;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" pb={pb ?? 3.5} pt={pt}>
      <Typography
        variant="body2"
        lineHeight="22px"
        className={`${isRejected ? 'rejected' : ''} ${isTotal ? 'total' : ''}`}
        sx={{
          color: '#363636',

          '&.rejected': {
            color: '#b9b9b9',
          },

          '&.total': {
            fontWeight: '700',
          },
        }}
      >
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
        className={`${isNegative ? 'negative' : ''} ${isRejected ? 'rejected' : ''} ${isTotal ? 'total' : ''}`}
        sx={{
          color: '#737373',

          '&.negative': {
            color: theme.palette.danger.main,
          },

          '&.rejected': {
            color: '#b9b9b9',
          },

          '&.total': {
            color: '#363636',
            fontWeight: '700',
          },
        }}
      >
        {typeof value === 'string' && value}

        {typeof value !== 'string' &&
          showBaseOnly &&
          `${isNegative ? '-' : ''}${hideCurrency ? '' : `${baseCurrency} `}${Math.abs(value).toFixed(
            decimalPrecision
          )}`}

        {typeof value !== 'string' &&
          !showBaseOnly &&
          `${isNegative ? '-' : ''}${secondaryCurrency} ${Math.abs(value) * excRate || 0} ~ 
          ${isNegative ? '-' : ''}
          ${baseCurrency} ${Math.abs(value || 0).toFixed(decimalPrecision)}`}
      </Typography>
    </Stack>
  );
}

export const getTotalOrderInSecondary = (order) => {
  const deliveryFee = order?.summary?.deliveryFee;
  const totalExceptDeliveryFee = order?.summary?.cash + order?.summary?.wallet + order?.summary?.card - deliveryFee;

  let totalBase = 0;
  totalBase += totalExceptDeliveryFee * order?.shopExchangeRate;

  if (order?.shop?.haveOwnDeliveryBoy) {
    totalBase += deliveryFee * order?.shopExchangeRate;
  } else {
    totalBase += deliveryFee * order?.adminExchangeRate;
  }

  return totalBase;
};
