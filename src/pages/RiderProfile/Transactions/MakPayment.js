import { Box, Stack, Typography } from '@mui/material';
import CloseButton from '../../../components/Common/CloseButton';

export default function MakePayment({ onClose }) {
  return (
    <Box
      sx={{
        background: '#fff',
        padding: '10px 20px',
        borderRadius: '7px',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        pb={3}
        // borderBottom="1px solid"
        // borderColor="custom.border"
      >
        <Typography variant="h4">Make Payment</Typography>
        <CloseButton onClick={onClose} size="sm" />
      </Stack>
      <Box></Box>
    </Box>
  );
}
