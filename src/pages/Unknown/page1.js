// third party
import { Box, Stack, Typography, useTheme } from '@mui/material';

// project import
import Wrapper from '../../components/Wrapper';

export default function Page1() {
  const theme = useTheme();

  return (
    <Wrapper>
      <Box className="page-content" sx={{ height: '100vh' }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
            }}
          >
            Settings
          </Typography>
          <Typography variant="body3" color={theme.palette.custom.subHeading}>
            Customize admin settings
          </Typography>
        </Box>
        <Stack gap={5}>
          <Box
            onClick={() => {
              console.log('Clicked');
            }}
          >
            <Typography variant="h5">Marketing</Typography>
            <Typography variant="h5">Restaurants</Typography>
            <Typography variant="h5">Users</Typography>
          </Box>
        </Stack>
      </Box>
    </Wrapper>
  );
}
