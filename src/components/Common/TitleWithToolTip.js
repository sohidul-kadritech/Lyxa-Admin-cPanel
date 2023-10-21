import { Stack, Tooltip, Typography } from '@mui/material';
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg';

const sizes = {
  medium: {
    fontWeight: '600',
    fontSize: '15px',
    lineHeight: '18px',
  },
  small: {
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '18px',
    letterSpacing: 0,
  },
};

export function TitleWithToolTip({ title, tooltip, alignItems = 'center', sx, size = 'medium' }) {
  return (
    <Stack direction="row" alignItems={alignItems} justifyContent="flex-start" gap={2} sx={sx}>
      <Typography
        variant="h5"
        sx={{
          ...(sizes[size] || {}),
          ...(sx || {}),
        }}
      >
        {title}
      </Typography>
      {tooltip && (
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
      )}
    </Stack>
  );
}
