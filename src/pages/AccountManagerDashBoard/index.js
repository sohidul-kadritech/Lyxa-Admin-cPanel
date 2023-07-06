import { Box, Typography } from '@mui/material';

// project import
// import Greeting from './Greeting';

import Greeting from './Greeting';
import Orders from './Orders';

function AccountManagerDashBoard() {
  return (
    <Box pt={9} pb={12}>
      <Typography variant="h4" pb={14}>
        Dashboard
      </Typography>
      <Greeting />
      <Box pt={7.5}>
        <Orders />
      </Box>
    </Box>
  );
}

export default AccountManagerDashBoard;
