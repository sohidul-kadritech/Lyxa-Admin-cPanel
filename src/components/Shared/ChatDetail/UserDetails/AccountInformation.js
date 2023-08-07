import { Box, Stack, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { StyledProfileBox } from './helpers';

function ListItem({ label, value, props, link }) {
  const history = useHistory();

  return (
    <Stack gap={1.5} {...props}>
      <Typography variant="inherit" fontWeight={400} fontSize="14px" lineHeight="16.94px" color="text.secondary2">
        {label}
      </Typography>
      <Typography
        variant="inherit"
        fontWeight={500}
        fontSize="14px"
        lineHeight="16.94px"
        sx={link ? { cursor: 'pointer', color: 'primary.main' } : undefined}
        onClick={link ? () => history.push(link) : undefined}
      >
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
        <ListItem label="Full Name" value={user?.name} link={`/accounts/${user?._id}`} />
        <ListItem label="Gender" value="Male" />
        <ListItem label="Email ID" value={user?.email} />
        <ListItem label="Date of Birth" value="June 26, 1995" />
      </Box>
    </StyledProfileBox>
  );
}
