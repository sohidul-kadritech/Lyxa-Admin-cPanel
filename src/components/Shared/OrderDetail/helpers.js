/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useGlobalContext } from '../../../context';
import FormateBaseCurrency from '../../Common/FormateBaseCurrency';
import FormatesecondaryCurrency from '../../Common/FormatesecondaryCurrency';
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
  showBaseOnly,
  showSecondaryOnly,
}) {
  const theme = useTheme();
  const context = useContext(OrderContext);
  const { adminExchangeRate } = context || {};
  const hideSecondary = adminExchangeRate === 0;
  const { general } = useGlobalContext();

  const { appSetting } = general;

  // initialize currency format
  FormateBaseCurrency.initialize(appSetting?.baseCurrency?.code);
  FormatesecondaryCurrency.initialize(appSetting?.secondaryCurrency?.code);

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
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '2px',

          '&.rejected': {
            color: '#b9b9b9',
          },

          '&.total': {
            fontWeight: '700',
          },
        }}
      >
        <Typography component="span"> {label}</Typography>
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
          `${isNegative || value < 0 ? '-' : ''} ${FormateBaseCurrency.get(Math.abs(value || 0))}`}
        {/* `${isNegative || value < 0 ? '-' : ''}${baseCurrency}${Math.abs(value || 0).toFixed(decimalPrecision)}`} */}

        {/* show secondary Only */}
        {typeof value !== 'string' &&
          showSecondaryOnly &&
          `${isNegative || value < 0 ? '-' : ''} ${FormatesecondaryCurrency.get(Math.abs(valueSecondary || 0))}`}

        {/* base and secondary both */}
        {typeof value !== 'string' &&
          !showBaseOnly &&
          !showSecondaryOnly &&
          `
          ${
            hideSecondary
              ? ''
              : `${isNegative || valueSecondary < 0 ? '-' : ''} ${FormatesecondaryCurrency.get(
                  Math.abs(valueSecondary || 0),
                )} ~ `
          }
          ${isNegative || value < 0 ? '-' : ''} ${FormateBaseCurrency.get(Math.abs(value || 0))}`}
      </Typography>
    </Stack>
  );
}
