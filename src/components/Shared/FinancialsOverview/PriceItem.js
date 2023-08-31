import { Stack, Tooltip, Typography } from '@mui/material';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';
import { useGlobalContext } from '../../../context';

export default function PriceItem({
  title,
  amount,
  fontSize,
  titleSx,
  amountSx,
  tooltip,
  hide,
  showIfZero,
  isNegative,
  isRefused,
  sx,
}) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  if (hide) return null;
  if (Number((amount || 0).toFixed(2)) === 0 && !showIfZero) return null;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ ...(sx || {}) }}>
      <Typography
        variant="body1"
        fontWeight={600}
        fontSize={fontSize}
        sx={titleSx}
        display="inline-flex"
        gap={1.5}
        alignItems="center"
      >
        {title}
        {tooltip && (
          <Tooltip title={tooltip}>
            <InfoIcon />
          </Tooltip>
        )}
      </Typography>
      <Typography
        className={`${isNegative ? 'negative' : ''} ${isRefused ? 'refused' : ''}`}
        sx={{
          '&.negative': {
            color: 'error.main',
          },

          '&.refused': {
            color: '#b9b9b9',
          },

          ...amountSx,
        }}
        variant="body1"
        fontWeight={600}
        fontSize={fontSize}
      >
        {isNegative ? '-' : ''} {currency} {(amount || 0).toFixed(2)}
      </Typography>
    </Stack>
  );
}
