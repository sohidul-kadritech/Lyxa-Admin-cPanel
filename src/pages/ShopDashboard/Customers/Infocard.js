// third party
import { Box, Stack, Typography, useTheme } from '@mui/material';

// project import
import IncreaseDecrease from '../../../components/StyledCharts/IncreaseDecrease';
import StyledBox from '../../../components/StyledCharts/StyledBox';

export default function CustomerInfoCard({ title, dotColor, amount, isActive, onClick, index }) {
  const theme = useTheme();

  return (
    <StyledBox
      padding
      sx={{
        outline: '1px solid transparent',
        transition: '100ms ease',

        '&:hover, &.active': {
          border: `1px solid ${theme.palette.primary.main}`,
          outline: `1px solid ${theme.palette.primary.main}`,
        },
      }}
      className={isActive ? 'active' : undefined}
      onClick={() => onClick(index)}
    >
      <Stack direction="row" alignItems="center" gap={2} pb={4.5}>
        {/* dot */}
        <Box
          sx={{
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            background: dotColor,
          }}
        ></Box>
        {/* title */}
        <Typography variant="body1" fontWeight={600}>
          {title}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        <Typography variant="inherit" fontSize={40} fontWeight={600} lineHeight={1}>
          {amount}
        </Typography>
        <IncreaseDecrease amount="4%" status="increase" />
      </Stack>
    </StyledBox>
  );
}
