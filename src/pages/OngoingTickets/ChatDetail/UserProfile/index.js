import { Stack } from '@mui/material';
import { mockAddress, mockCoupons, mockTransactions } from '../../mock';
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
    </Stack>
  );
}
