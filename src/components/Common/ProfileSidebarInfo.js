import { Box, Stack, Typography } from '@mui/material';

export default function ProfileSidebarInfo({ label, value, icon: Icon }) {
  return (
    <Box>
      <Stack direction="row" sx={{ justifyItems: 'center', alignItems: 'center', gap: '11px' }} pb={4.5}>
        <Icon />
        <Typography variant="inherit" sx={{ fontSize: '14px', fontWeight: '600' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="inherit" sx={{ textTransform: 'capitalize', fontSize: '14px', fontWeight: '500' }}>
        {value}
      </Typography>
    </Box>
  );
}
