import { Box, Button, Stack, Typography } from '@mui/material';
import StyledFormInput from './StyledFormInput';

export default function Form() {
  return (
    <Box
      sx={{
        width: '380px',
      }}
    >
      <Stack gap={5}>
        <StyledFormInput label="Email" placeholder="john.dowry@example.com" type="email" />
        <Box>
          <StyledFormInput label="Password" placeholder="XXXXXXXX" type="password" />
          <Typography
            variant="inherit"
            color="#fff"
            fontSize={14}
            lineHeight="20px"
            fontWeight={500}
            pt={2}
            textAlign="right"
          >
            Forgot Password
          </Typography>
        </Box>
        <Box pt={4}>
          <Button
            variant="contained"
            fullWidth
            color="error"
            sx={{
              padding: '10px 30px',
              borderRadius: '7px',
            }}
          >
            Log In
          </Button>
          <Typography
            variant="inherit"
            color="#fff"
            fontSize={14}
            lineHeight="20px"
            fontWeight={500}
            pt={3}
            textAlign="center"
          >
            Join our network of restaurant partners
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
