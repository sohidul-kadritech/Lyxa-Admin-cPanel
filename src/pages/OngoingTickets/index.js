import { Box, Unstable_Grid2 as Grid, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import { useGlobalContext } from '../../context';

export default function OngoingTickets() {
  const { currentUser } = useGlobalContext();
  const { admin } = currentUser;
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Grid container>
      <Grid lg={7}>
        <Box>
          <Typography variant="h4" pb={10}>
            Dashboard
          </Typography>
          <UserProfileInfo
            user={{
              name: admin?.name,
              email: admin?.email,
              phone: admin?.phone_number,
            }}
            avatarProps={{
              sx: { width: 70, height: 70 },
            }}
            containerProps={{ sx: { gap: 5 } }}
          />
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
            sx={{
              paddingTop: '40px',

              '& .MuiTab-root': {
                padding: '8px 12px',
                textTransform: 'none',
              },
            }}
          >
            <Tab label="Orders Ticket" />
            <Tab label="Account Tickets" />
          </Tabs>
        </Box>
      </Grid>
      <Grid lg={5}></Grid>
    </Grid>
  );
}
