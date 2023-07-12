import { Box, Button, Stack } from '@mui/material';
import { mockTransactions } from '../../../../pages/OngoingTickets/mock';
import AccountInformation from './AccountInformation';
import Address from './Address';
import Coupons from './Coupon';
import CreditCards from './CreditCards';
import LastOrders from './LastOrders';
import Transactions from './Transactions';

export default function UserDetails({ user }) {
  console.log('chat-user', user);

  return (
    <Stack gap={5} pb={5}>
      <AccountInformation user={user} />
      <CreditCards cards={user?.cards} />
      <Address addressList={user?.address} />
      <Coupons coupons={user?.coupons} />
      <Transactions transactions={mockTransactions} />
      <LastOrders />
      <Stack direction="row" gap={5} pt={2.5}>
        <Button variant="outlined" fullWidth>
          Remove Credit
        </Button>
        <Button variant="contained" fullWidth>
          Add Credit
        </Button>
      </Stack>
      <Box>
        <Button variant="text" fullWidth sx={{ color: 'error.main', fontWeight: '400', textDecoration: 'underline' }}>
          Deactivate Account
        </Button>
      </Box>
    </Stack>
  );
}
