import { Stack, Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../../context';

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
  exchangeRate = 1,
  skipExchangeRate,
  decimalPrecision = 2,
}) {
  const theme = useTheme();
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  if (hide) return null;
  if (!showIfZero && !value) return null;
  // eslint-disable-next-line no-param-reassign
  if (skipExchangeRate) exchangeRate = 1;

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
          `${isNegative ? '- ' : ''}${hideCurrency ? '' : `${currency} `}${(
            Math.abs(value) / exchangeRate || 0
          ).toFixed(decimalPrecision)}`}
      </Typography>
    </Stack>
  );
}
