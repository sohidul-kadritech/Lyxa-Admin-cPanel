import { Stack, Tooltip, Typography } from '@mui/material';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';

export function HeaderWith({ title, tooltip }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={0.5}>
      <Typography
        variant="body4"
        fontWeight={600}
        sx={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}
      >
        {title}
      </Typography>
      <Tooltip
        arrow
        title={tooltip}
        sx={{
          '.MuiTooltip-popper': {
            zIndex: '9999999 !important',
          },
        }}
      >
        <InfoIcon />
      </Tooltip>
    </Stack>
  );
}
