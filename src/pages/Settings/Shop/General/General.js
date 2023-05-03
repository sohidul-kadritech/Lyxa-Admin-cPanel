import { Box, Typography } from '@material-ui/core';
import { Stack } from '@mui/material';

// export.module
export function General() {
  const generalSx = {
    padding: '24px 30px',
    width: '100%',
    color: '#000',
  };

  const ActionSx = {
    margin: '22px 0px',
  };

  return (
    <Box sx={generalSx}>
      <Typography>General</Typography>
      <Stack sx={ActionSx} direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography>Allow customers to add special instructions to individual items</Typography>
        </Box>
        <Box>
          <Typography>Hello</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
