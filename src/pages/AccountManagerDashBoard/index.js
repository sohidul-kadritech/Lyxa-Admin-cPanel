import { Box, Button, Drawer, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useGlobalContext } from '../../context';
import EditAdminProfile from '../SalesManagerDashBoard/EditAdminProfile';
import Orders from './Orders';
import ShopRanking from './ShopRanking';
import UserInfo from './UserInfo';

function AccountManagerDashBoard() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useGlobalContext();
  const admin = currentUser?.admin;

  return (
    <Box pt={9} pb={12}>
      <Typography variant="h4" pb={14}>
        Dashboard
      </Typography>
      <Stack direction="row" width="100%">
        <Box flex={1}>
          <UserInfo />
        </Box>
        <Button
          disableRipple
          sx={{
            fontWeight: '500',
            fontSize: '17px',
            lineHeight: '28px',
            textDecorationLine: 'underline',
            textUnderlineOffset: '2px',
            padding: '0px',
            gap: '11px',
            '& .MuiButton-startIcon, & .MuiButton-endIcon': {
              margin: '0px',
            },
          }}
          variant="text"
          color="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          Profile Settings
        </Button>
      </Stack>
      <Box pt={7.5}>
        <Orders />
      </Box>
      <Box pt={7.5}>
        <ShopRanking />
      </Box>

      <Drawer anchor="right" open={open}>
        <EditAdminProfile
          isEdit
          currentAdmin={admin}
          onClose={() => {
            setOpen(false);
          }}
          adminType="accountManager"
        />
      </Drawer>
    </Box>
  );
}

export default AccountManagerDashBoard;
