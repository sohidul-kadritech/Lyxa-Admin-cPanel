// third party
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';

// project import
export function IncreaseDecreaseTag({ status }) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: status === 'increase' ? theme.palette.success.main : theme.palette.primary.main,
        marginBottom: '-5px',
        paddingLeft: 1,
      }}
    >
      {status === 'increase' ? (
        <ArrowDropUpIcon
          sx={{
            fontSize: '35px',
          }}
        />
      ) : (
        <ArrowDropDownIcon
          sx={{
            fontSize: '35px',
          }}
        />
      )}
      <Typography
        variant="body1"
        sx={{
          fontSize: '12px',
          lineHeight: '24px',
          fontWeight: '600',
        }}
      >
        4% last 30 days
      </Typography>
    </Stack>
  );
}

export function ViewMoreTag() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: '1',
        textAlign: 'right',
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        startIcon={<VisibilityIcon />}
        sx={{
          fontWeight: '500',
          fontSize: '12px',
          lineHeight: '1',
          background: theme.palette.background.secondary,
          color: theme.palette.secondary.main,
          padding: '8px 17.5px',

          '&:hover': {
            color: theme.palette.secondary.main,
            background: theme.palette.background.secondaryHover,
          },
        }}
      >
        View details
      </Button>
    </Box>
  );
}
