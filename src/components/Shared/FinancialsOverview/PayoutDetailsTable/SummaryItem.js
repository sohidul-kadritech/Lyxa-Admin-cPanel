import { Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useGlobalContext } from '../../../../context';
import { CustomInfoIcon } from '../../OrderDetail/helpers';

export default function SummaryItem({
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
  decimalPrecision = 2,
  valueSecondary,
  currencyType,
  // fontSize,
  title,
}) {
  const theme = useTheme();
  const { general } = useGlobalContext();

  if (hide) return null;
  if (!showIfZero && currencyType === 'baseCurrency' && !value) return null;
  if (!showIfZero && currencyType === 'secondaryCurrency' && !valueSecondary) return null;

  const currency =
    currencyType === 'baseCurrency'
      ? general?.appSetting?.baseCurrency?.symbol
      : general?.appSetting?.secondaryCurrency?.symbol;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" pb={pb ?? 3.5} pt={pt}>
      {label && (
        <Typography
          variant="inherit"
          lineHeight="13px"
          className={`${isRejected ? 'rejected' : ''} ${isTotal ? 'total' : ''}`}
          sx={{
            color: '#363636',
            fontSize: title ? '15px' : '11px',

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
      )}

      <Typography
        variant="inherit"
        lineHeight="13px"
        className={`${isNegative ? 'negative' : ''} ${isRejected ? 'rejected' : ''} ${isTotal ? 'total' : ''} ${
          title ? 'title' : ''
        }`}
        sx={{
          color: '#737373',
          fontSize: title ? '15px' : '11px',

          '&.title': {
            color: '#363636',
          },

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

        {/*  base value */}
        {typeof value !== 'string' &&
          currencyType === 'baseCurrency' &&
          `${isNegative || value < 0 ? '-' : ''}${currency}${Math.abs(value || 0).toFixed(decimalPrecision)}`}

        {/* secondary value */}
        {typeof value !== 'string' &&
          currencyType === 'secondaryCurrency' &&
          `${isNegative || value < 0 ? '-' : ''}${currency}${Math.round(Math.abs(valueSecondary || 0))}`}
      </Typography>
    </Stack>
  );
}
