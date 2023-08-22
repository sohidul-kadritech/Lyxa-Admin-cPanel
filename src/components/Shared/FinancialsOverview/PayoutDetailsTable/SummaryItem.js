import { Stack, Tooltip, Typography, useTheme } from '@mui/material';
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
  currency,
}) {
  const theme = useTheme();
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
          `${isNegative || value < 0 ? '-' : ''}${currency}${Math.abs(value || 0).toFixed(decimalPrecision)}`}
      </Typography>
    </Stack>
  );
}
