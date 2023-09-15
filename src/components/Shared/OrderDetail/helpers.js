/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { OrderContext } from './OrderContext';

// Order Details Handling
export function StyledOrderDetailBox({ title, children, sx }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
        ...(sx || {}),
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

export const CustomInfoIcon = React.forwardRef(({ style, ...props }, ref) => (
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

      ...(style || {}),
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
  valueSecondary,
  isTotal,
  isRejected,
  isNegative,
  showIfZero,
  decimalPrecision = 2,
  showBaseOnly,
}) {
  const theme = useTheme();
  const context = useContext(OrderContext);
  const { baseCurrency, secondaryCurrency, adminExchangeRate } = context || {};
  const hideSecondary = adminExchangeRate === 0;

  if (hide) return null;
  if (!showIfZero && !value) return null;

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
        {/* string value */}
        {typeof value === 'string' && value}

        {/* not base value */}
        {typeof value !== 'string' &&
          showBaseOnly &&
          `${isNegative || value < 0 ? '-' : ''}${baseCurrency}${Math.abs(value || 0).toFixed(decimalPrecision)}`}

        {/* base and secondary both */}
        {typeof value !== 'string' &&
          !showBaseOnly &&
          `
          ${
            hideSecondary
              ? ''
              : `${isNegative || valueSecondary < 0 ? '-' : ''}${secondaryCurrency} ${Math.round(
                  Math.abs(valueSecondary),
                )} ~ `
          }
          ${isNegative || value < 0 ? '-' : ''}${baseCurrency} ${Math.abs(value || 0).toFixed(decimalPrecision)}`}
      </Typography>
    </Stack>
  );
}
