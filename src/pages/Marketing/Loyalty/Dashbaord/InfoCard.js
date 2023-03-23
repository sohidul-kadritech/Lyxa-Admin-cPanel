// thrid party
import { Box, Stack, Typography } from '@mui/material';

export default function InfoCard({ title, value, Tag }) {
  return (
    <Box
      sx={{
        padding: '14px 10px 10px 20px',
      }}
    >
      <Typography
        variant="h6"
        pb={4.5}
        sx={{
          lineHeight: '24px',
          fontWeight: '600',
        }}
      >
        {title}
      </Typography>
      <Stack direction="row" alignItems="flex-end">
        <Typography
          variant="h2"
          sx={{
            lineHeight: '24px',
            fontSize: '40px !important',
          }}
        >
          {value}
        </Typography>
        {/* tag component */}
        {Tag}
      </Stack>
    </Box>
  );
}
