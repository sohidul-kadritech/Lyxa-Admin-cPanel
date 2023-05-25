import { Box, Button, Stack } from '@mui/material';
import { mockAddress, mockCoupons, mockTransactions } from '../../../../pages/OngoingTickets/mock';
import AccountInfomation from './AccountInformation';
import Address from './Address';
import Coupons from './Coupon';
import CreditCards from './CreditCards';
import LastOrders from './LastOrders';
import Transactions from './Transactions';

export default function UserProfile({ user }) {
  return (
    <Stack gap={5} pb={5}>
      <AccountInfomation user={user} />
      <CreditCards user={user} />
      <Address addressList={mockAddress} />
      <Coupons coupons={mockCoupons} />
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
