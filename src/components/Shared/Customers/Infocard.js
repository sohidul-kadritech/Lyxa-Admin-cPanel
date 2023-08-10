// third party
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';

// project import
import IncreaseDecrease from '../../StyledCharts/IncreaseDecrease';
import StyledBox from '../../StyledCharts/StyledBox';

export default function CustomerInfoCard({
  title,
  percentage,
  dotColor,
  amount,
  isActive,
  onClick,
  index,
  hidePercentage,
  tooltip,
}) {
  const theme = useTheme();

  console.log({ hidePercentage });

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
          {tooltip && (
            <>
              &nbsp;
              <Tooltip title={tooltip}>
                <InfoIcon />
              </Tooltip>
            </>
          )}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        <Typography variant="inherit" fontSize={40} fontWeight={600} lineHeight={1}>
          {amount}
        </Typography>
        {!hidePercentage && (
          <IncreaseDecrease amount={`${percentage || 0}%`} status={`${percentage >= 0 ? 'increase' : 'decrease'}`} />
        )}
      </Stack>
    </StyledBox>
  );
}
