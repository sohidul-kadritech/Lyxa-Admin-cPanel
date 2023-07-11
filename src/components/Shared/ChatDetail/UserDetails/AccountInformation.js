import { Box, Stack, Typography } from '@mui/material';
import { StyledProfileBox } from './helpers';

function ListItem({ label, value, props }) {
  return (
    <Stack gap={1.5} {...props}>
      <Typography variant="inherit" fontWeight={400} fontSize="14px" lineHeight="16.94px" color="text.secondary2">
        {label}
      </Typography>
      <Typography variant="inherit" fontWeight={500} fontSize="14px" lineHeight="16.94px">
        {value || '_'}
      </Typography>
    </Stack>
  );
}

export default function AccountInfomation({ user }) {
  return (
    <StyledProfileBox title="Account Information">
      <Box
        direction="row"
        flexWrap="nowrap"
        pt={2}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          rowGap: '30px',
          columnGap: '20px',
        }}
      >
        <ListItem label="Full Name" value={user?.name} />
        <ListItem label="Gender" value="Male" />
        <ListItem label="Email ID" value={user?.email} />
        <ListItem label="Date of Birth" value="June 26, 1995" />
      </Box>
    </StyledProfileBox>
  );
}
