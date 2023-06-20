import { Stack, Tooltip, Typography } from '@mui/material';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';
import { useGlobalContext } from '../../../context';

export default function PriceItem({ title, amount, amountStatus, fontSize, titleSx, amountSx, tooltip }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
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
        sx={amountSx}
        variant="body1"
        fontWeight={600}
        fontSize={fontSize}
        color={amountStatus === 'minus' ? 'error' : amountStatus === 'secondary' ? '#b9b9b9' : undefined}
      >
        {amountStatus === 'minus' ? '-' : ''} {currency} {(amount || 0).toFixed(2)}
      </Typography>
    </Stack>
  );
}
